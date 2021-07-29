const saito = require('./saito');
const fetch = require('node-fetch');
const { set } = require('numeral');
const Base58 = require("base-58");
const secp256k1 = require('secp256k1');

const blake3 = require('blake3');

const Big = require('big.js');
const Transaction = require('./transaction');

let TRANSACTION_SIZE = 89;
let SLIP_SIZE = 75;
let HOP_SIZE = 130;
let BLOCK_HEADER_SIZE = 205;

/**
 * Network Constructor
 * @param {*} app
 */
class Network {

  constructor(app) {

    this.app = app || {};

    this.peers = [];

    this.peer_monitor_timer = null;
    this.peer_monitor_timer_speed = 10000;  // check socket status every 20 seconds
    this.peer_monitor_connection_timeout = 5000; // give sockets 5 seconds to connect before killing them.


    this.peers_connected = 0;
    this.peers_connected_limit = 2048; // max peers

    //
    // default comms behavior
    //
    this.sendblks = 1;
    this.sendtxs = 1;
    this.sendgts = 1;
    this.receiveblks = 1;
    this.receivetxs = 1;
    this.receivegts = 1;

    //
    // list of sockets for audit
    //
    this.sockets = [];

    this.api_call_index = 0;
    this.api_callbacks = {};
    //
    // downloads
    //
    this.downloads = {};
    this.downloads_hmap = {};
    this.downloading_active = 0;
    this.block_sample_size = 15;

    //
    // manage peer disconnections, to provide fall-back
    // reconnect logic in the event socket.io fails to
    // reconnect to a rebooted peer
    //
    this.dead_peers = [];

  }


  updatePeersWithWatchedPublicKeys() {

    let message = "keylist";
    let keylist = this.app.keys.returnWatchedPublicKeys();

    for (let i = 0; i < this.peers.length; i++) {
      this.app.network.peers[i].sendRequestWithCallback(message, keylist, function () { });
    }

  }

  u64FromBytes(bytes) {
    let top = new Big(this.u32FromBytes(bytes.slice(0,4)));
    let bottom = new Big(this.u32FromBytes(bytes.slice(4,8)));
    let max_u32 = new Big(4294967296);
    return (top.times(max_u32)).plus(bottom);
  }

  u64AsBytes(bigValue) {
    let max_u32 = new Big(4294967296);
    let top = bigValue.div(max_u32).round(0, Big.roundDown);
    let bottom = bigValue.minus(top);
    let top_bytes = this.u32AsBytes(Number(top));
    let bottom_bytes = this.u32AsBytes(Number(bottom));
    return Buffer.concat([
      new Uint8Array(top_bytes),
      new Uint8Array(bottom_bytes),
    ]);
  }
  
  u32FromBytes(bytes) {
    var val = 0;
    for (var i = 0; i < bytes.length; ++i) {
        val += bytes[i];
        if (i < bytes.length-1) {
            val = val << 8;
        }
    }
    return val;
  }

  u32AsBytes(val){
    var bytes = [];
    var i = 4;
    do {
      bytes[--i] = val & (255);
      val = val>>8;
    } while ( i )
    return bytes;
  }

  u8FromByte(byte) {
    return 0 + byte;
  }

  u8AsByte(val){
    return val & (255);
  }
  async wsConnectToRustPeer() {
    const WebSocket = require('ws');
    const ws = new WebSocket('http://127.0.0.1:3030/wsopen');

    ws.on('open', async (event) => {
      let init_handshake_message = Buffer.concat([
        new Uint8Array([127,0,0,1]),
        Base58.decode(this.app.wallet.returnPublicKey())
      ]);
      let handshake_init_response_data = await this.sendAPICall(ws, "SHAKINIT", init_handshake_message);
      let handshake_challenge = this.deserializeHandshakeChallenge(handshake_init_response_data);

      console.log(`${handshake_challenge.their_ip_octets[0]}.${handshake_challenge.their_ip_octets[1]}.${handshake_challenge.their_ip_octets[2]}.${handshake_challenge.their_ip_octets[3]}`);
      console.log(`${handshake_challenge.my_ip_octets[0]}.${handshake_challenge.my_ip_octets[1]}.${handshake_challenge.my_ip_octets[2]}.${handshake_challenge.my_ip_octets[3]}`);
      console.log(this.app.crypto.compressPublicKey(handshake_challenge.their_address));
      console.log(this.app.crypto.compressPublicKey(handshake_challenge.my_address));
      console.log(this.app.crypto.toBase58(handshake_challenge.their_sig));

      let is_sig_valid = secp256k1.verify(
        Buffer.from(blake3.hash(Buffer.from(handshake_init_response_data.slice(0, 82),'hex')),'hex'),
        handshake_challenge.their_sig,
        handshake_challenge.their_address
      );
      console.log(is_sig_valid);

      let { signature, recovery } = secp256k1.sign(
        Buffer.from(blake3.hash(handshake_init_response_data), 'hex'),
        Buffer.from(this.app.wallet.returnPrivateKey(), 'hex')
      );

      const bytes = Buffer.concat([
        handshake_init_response_data,
        signature
      ]);

      let handshake_complete_response_data = await this.sendAPICall(ws, "SHAKCOMP", bytes);
    });
    ws.on('message', (data) => {
      let api_message = this.deserializeAPIMessage(data);
      if (api_message.command === "RESULT__") {
        this.receiveAPIResponse(api_message);
      } else if (api_message.command === "ERROR___") {
        this.receiveAPIError(api_message);
      }
    });
    ws.on('error', (event) => {
      console.log(`[error] ${event.message}`);
    });
    ws.on('close', (event) => {
      console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    });
  }
  /**
   * A simple mechanism for managing responses to messages sent over the socket
   * @param {WebSocket} ws
   * @param {8-byte Array} command
   * @param {byte Vector} message_bytes
   * @returns
   */
  sendAPICall(ws, command, message_bytes) {
    return new Promise((resolve, reject) => {
      this.api_callbacks[this.api_call_index] = {
        resolve: resolve,
        reject: reject
      };
      let serialized_api_message = this.serializeAPIMessage(command, this.api_call_index, message_bytes);
      this.api_call_index += 1;
      ws.send(serialized_api_message);
    });
  }
  /**
   *
   * @param {byte Vector} bytes
   */
  receiveAPIResponse(api_message) {
    if(this.api_callbacks[api_message.index]) {
      this.api_callbacks[api_message.index].resolve(api_message.raw_message);
    } else {
      throw "response callback not found";
    }
  }
  /**
   *
   * @param {byte Vector} bytes
   */
  receiveAPIError(bytes) {
    let index = this.u32FromBytes(bytes.slice(8,12));
    if(this.api_callbacks[index]) {
      this.api_callbacks[index].reject(bytes.slice(12));
    } else {
      throw "error callback not found";
    }
  }

  serializeAPIMessage(command, index, data) {
    const enc = new TextEncoder();
    const command_bytes = enc.encode(command);
    const data_bytes = new Uint8Array(data);
    let index_as_bytes = this.u32AsBytes(index);
    const bytes = new Uint8Array([
      ...command_bytes,
      ...index_as_bytes,
      ...data_bytes
    ]);
    return bytes;
  }
  deserializeAPIMessage(bytes) {
    return {
      command: `${bytes.slice(0,8)}`,
      index: this.u32FromBytes(bytes.slice(8,12)),
      raw_message: bytes.slice(12)
    }
  }
  deserializeHandshakeChallenge(buffer) {
    let their_ip_octets = [];
    their_ip_octets[0] = buffer.readUInt8(0);
    their_ip_octets[1] = buffer.readUInt8(1);
    their_ip_octets[2] = buffer.readUInt8(2);
    their_ip_octets[3] = buffer.readUInt8(3);

    let my_ip_octets = [];
    my_ip_octets[0] = buffer.readUInt8(4);
    my_ip_octets[1] = buffer.readUInt8(5);
    my_ip_octets[2] = buffer.readUInt8(6);
    my_ip_octets[3] = buffer.readUInt8(7);

    let their_address = buffer.slice(8, 41);
    let my_address = buffer.slice(41, 74);
    let timestamp = buffer.slice(74, 82);
    let their_sig = buffer.slice(82, 146);
    return {
      their_ip_octets: their_ip_octets,
      my_ip_octets: my_ip_octets,
      their_address: their_address,
      my_address: my_address,
      timestamp: timestamp,
      their_sig: their_sig
    }
  }


  serializeBlock(block) {
    let transactions_length = this.u32AsBytes(block.transactions.length);
    let id = this.u64AsBytes(block.id);
    let timestamp = this.u64AsBytes(block.timestamp);
    let previous_block_hash = Buffer.from(block.previous_block_hash, 'hex');
    let creator = Buffer.from(block.creator, 'hex');
    let merkle_root = Buffer.from(block.merkle_root, 'hex');
    let signature = Buffer.from(block.signature, 'hex');
    let treasury = this.u64AsBytes(block.treasury);
    let burnfee = this.u64AsBytes(block.burnfee);
    let difficulty = this.u64AsBytes(block.difficulty);
    let block_header_data = new Uint8Array([
      ...transactions_length,
      ...id,
      ...timestamp,
      ...previous_block_hash,
      ...creator,
      ...merkle_root,
      ...signature,
      ...treasury,
      ...burnfee,
      ...difficulty,
    ]);
    let start_of_tx_data = BLOCK_HEADER_SIZE;
    
    
    // TODO This calls serializeTransaction twice for each tx
    // The problem is that we need to allocate the entire Uint8Array up front.
    // There is also a problem with the way we are writing the transaction data here
    // or deserializing it in deserializeBlock.

    // I'm not sure what is the best solution here...
    let total_tx_length = 0;
    let transactions = [];
    for(let i = 0; i < block.transactions.length; i++) {
      let next_tx_data = this.serializeTransaction(block.transactions[i]);
      total_tx_length += next_tx_data.length;
      transactions.push(next_tx_data);
    }


    let ret = new Uint8Array(start_of_tx_data + total_tx_length);
    ret.set(block_header_data, 0);

    let next_tx_location = start_of_tx_data;
    for(let i = 0; i < transactions.length; i++) {
      let next_tx_data = this.serializeTransaction(block.transactions[i]);
      ret.set(next_tx_data, next_tx_location);
      next_tx_location += transactions[i].length;
    }

    return ret;
  }
  deserializeBlock(buffer) {
    let block = { transactions: [] };

    let transactions_length = this.u32FromBytes(buffer.slice(0, 4));
    block.id = this.u64FromBytes(buffer.slice(4, 12));
    block.timestamp = this.u64FromBytes(buffer.slice(12, 20));
    block.previous_block_hash = this.app.crypto.stringToHex(buffer.slice(20, 52));
    block.creator = this.app.crypto.stringToHex(buffer.slice(52, 85));
    block.merkle_root = this.app.crypto.stringToHex(buffer.slice(85, 117));
    block.signature = this.app.crypto.stringToHex(buffer.slice(117, 181));
    block.treasury = this.u64FromBytes(buffer.slice(181, 189));
    block.burnfee = this.u64FromBytes(buffer.slice(189, 197));
    block.difficulty = this.u64FromBytes(buffer.slice(197, 205));
    let start_of_transaction_data = 205;
    for (let i = 0; i < transactions_length; i++) {
      let inputs_len = this.u32FromBytes(buffer.slice(start_of_transaction_data, start_of_transaction_data + 4));
      let outputs_len = this.u32FromBytes(buffer.slice(start_of_transaction_data + 4, start_of_transaction_data + 8));
      let message_len = this.u32FromBytes(buffer.slice(start_of_transaction_data + 8, start_of_transaction_data + 12));
      let path_len = this.u32FromBytes(buffer.slice(start_of_transaction_data + 12, start_of_transaction_data + 16));
      let end_of_transaction_data = start_of_transaction_data
            + TRANSACTION_SIZE
            + ((inputs_len + outputs_len) * SLIP_SIZE)
            + message_len
            + path_len * HOP_SIZE;

      let tx = this.deserializeTransaction(
        buffer,
        start_of_transaction_data
      );

      block.transactions.push(tx);
      start_of_transaction_data = end_of_transaction_data;
    }
    return block;
  }

  serializeTransaction(transaction) {
    let inputs_len = this.u32AsBytes(transaction.inputs.length);
    let outputs_len = this.u32AsBytes(transaction.outputs.length);
    let message_len = this.u32AsBytes(transaction.message.length);
    let path_len = this.u32AsBytes(transaction.path.length);
    let signature = Buffer.from(transaction.signature, 'hex');
    let timestamp = this.u64AsBytes(transaction.timestamp);
    let transaction_type = this.u8AsByte(transaction.transaction_type);
    let inputs = [];
    let outputs = [];
    let path = [];

    let start_of_inputs = TRANSACTION_SIZE;
    let start_of_outputs = TRANSACTION_SIZE + ((transaction.inputs.length) * SLIP_SIZE);
    let start_of_message = TRANSACTION_SIZE + ((transaction.inputs.length + transaction.outputs.length) * SLIP_SIZE);
    let start_of_path = TRANSACTION_SIZE + ((transaction.inputs.length + transaction.outputs.length) * SLIP_SIZE) + transaction.message.length;
    let size_of_tx_data = TRANSACTION_SIZE + ((transaction.inputs.length + transaction.outputs.length) * SLIP_SIZE) + transaction.message.length + transaction.path.length * HOP_SIZE;

    let ret = new Uint8Array(size_of_tx_data);
    ret.set(new Uint8Array([
        ...inputs_len,
        ...outputs_len,
        ...message_len,
        ...path_len,
        ...signature,
        ...timestamp,
        transaction_type]), 0);

    for(let i = 0; i < transaction.inputs.length; i++) {
      inputs.push(this.serializeSlip(transaction.inputs[i]));
    }
    let next_input_location = start_of_inputs;
    for(let i = 0; i < inputs.length; i++) {
      ret.set(inputs[i], next_input_location);
      next_input_location += SLIP_SIZE;
    }
    
    for(let i = 0; i < transaction.outputs.length; i++) {
      outputs.push(this.serializeSlip(transaction.outputs[i]));
    }
    let next_output_location = start_of_outputs;
    for(let i = 0; i < outputs.length; i++) {
      ret.set(outputs[i], next_output_location);
      next_output_location += SLIP_SIZE;
    }

    ret.set(transaction.message, start_of_message);

    for(let i = 0; i < transaction.path.length; i++) {
      let serialized_hop = this.serializeHop(transaction.path[i]);
      path.push(serialized_hop);
    }
    let next_hop_location = start_of_path;
    for(let i = 0; i < path.length; i++) {
      ret.set(path[i], next_hop_location);
      next_hop_location += HOP_SIZE;
    }
    
    return ret;
  }

  deserializeTransaction(buffer, start_of_transaction_data) {
    let inputs_len = this.u32FromBytes(buffer.slice(start_of_transaction_data, start_of_transaction_data + 4));
    let outputs_len = this.u32FromBytes(buffer.slice(start_of_transaction_data + 4, start_of_transaction_data + 8));
    let message_len = this.u32FromBytes(buffer.slice(start_of_transaction_data + 8, start_of_transaction_data + 12));
    let path_len = this.u32FromBytes(buffer.slice(start_of_transaction_data + 12, start_of_transaction_data + 16));

    let signature = this.app.crypto.stringToHex(buffer.slice(start_of_transaction_data + 16, start_of_transaction_data + 80));
    let timestamp = this.u64FromBytes(buffer.slice(start_of_transaction_data + 80, start_of_transaction_data + 88));
    let transaction_type = buffer[88];
    let start_of_inputs = TRANSACTION_SIZE;
    let start_of_outputs = start_of_inputs + inputs_len * SLIP_SIZE;
    let start_of_message = start_of_outputs + outputs_len * SLIP_SIZE;
    let start_of_path = start_of_message + message_len;

    let inputs = [];
    for (let i = 0; i <= inputs_len; i++) {
      let start_of_slip = start_of_inputs + (i * SLIP_SIZE);
      let end_of_slip = start_of_slip + SLIP_SIZE;
      let input = this.deserializeSlip(buffer.slice(start_of_slip, end_of_slip));
      inputs.push(input);
    }
    let outputs = [];
    for (let i = 0; i <= outputs_len; i++) {
      let start_of_slip = start_of_outputs + (i * SLIP_SIZE);
      let end_of_slip = start_of_slip + SLIP_SIZE;
      let input = this.deserializeSlip(buffer.slice(start_of_slip, end_of_slip));
      outputs.push(input);
    }
    let message = buffer.slice(start_of_message, start_of_message + message_len);
    
    let path = [];
    for (let i = 0; i <= path_len; i++) {
      let start_of_data = start_of_path + (i * HOP_SIZE);
      let end_of_data = start_of_data + HOP_SIZE;
      let hop = this.deserializeHop(buffer.slice(start_of_data, end_of_data));
      path.push(hop);
    }

    return {
      inputs: inputs,
      outputs: outputs,
      timestamp: timestamp,
      signature: signature,
      path: path,
      transaction_type: transaction_type,
      message: message,
    };
  }

  serializeSlip(slip) {
    let publickey = Buffer.from(slip.publickey, 'hex');
    let uuid = Buffer.from(slip.uuid, 'hex');
    let amount = this.u64AsBytes(slip.amount);
    let slip_ordinal = this.u8AsByte(slip.slip_ordinal);
    let slip_type = this.u8AsByte(slip.slip_type);

    return new Uint8Array([
      ...publickey,
      ...uuid,
      ...amount,
      slip_ordinal,
      slip_type,
    ]);
  }

  deserializeSlip(buffer) {
    let publickey = this.app.crypto.stringToHex(buffer.slice(0, 33));
    let uuid = this.app.crypto.stringToHex(buffer.slice(33, 65));
    let amount = this.u64FromBytes(buffer.slice(65, 73));
    let slip_ordinal = this.u8FromByte(buffer[73]);
    let slip_type = this.u8FromByte(buffer[SLIP_SIZE - 1]);
    return {
      publickey: publickey,
      uuid: uuid,
      amount: amount,
      slip_ordinal: slip_ordinal,
      slip_type: slip_type
    };
  }
  serializeHop(hop) {
    let from = Buffer.from(hop.from, 'hex');
    let to = Buffer.from(hop.to, 'hex');
    let sig = Buffer.from(hop.sig, 'hex');
    return new Uint8Array([
      ...from,
      ...to,
      ...sig,
    ]);;
  }
  deserializeHop(buffer) {
    let from = this.app.crypto.stringToHex(buffer.slice(0, 33));
    let to = this.app.crypto.stringToHex(buffer.slice(33, 66));
    let sig = this.app.crypto.stringToHex(buffer.slice(66, 130));
    return {
      from: from,
      to: to,
      sig: sig,
    }
  }

  async getDemoBlockFromRust() {
    const fetch = require('node-fetch');
    try {
      const url = `http://127.0.0.1:3030/block/f65500e23590dfc29bbec2a09e74d9d2a5363e1fc99d0f3bc37aa58d525f1d43`;
      // ee0846901675cd0d461dfdc37919a670b7ab704772c619446629077fd7f58a1f.sai
      // f65500e23590dfc29bbec2a09e74d9d2a5363e1fc99d0f3bc37aa58d525f1d43.sai

      const res = await fetch(url);
      const buffer = await res.buffer();

      let block = this.deserializeBlock(buffer);


    } catch(err) {
      console.log(err);
    }
  }

  initialize() {
    this.wsConnectToRustPeer();
    this.getDemoBlockFromRust();
    if (this.app.options) {
      if (this.app.options.server) {
        if (this.app.options.server.receiveblks !== undefined && this.app.options.server.receiveblks === 0) { this.receiveblks = 0; }
        if (this.app.options.server.receivetxs !== undefined && this.app.options.server.receivetxs === 0) { this.receivetxs = 0; }
        if (this.app.options.server.receivegts !== undefined && this.app.options.server.receivegts === 0) { this.receivegts = 0; }
        if (this.app.options.server.sendblks !== undefined && this.app.options.server.sendblks === 0) { this.sendblks = 0; }
        if (this.app.options.server.sendtxs !== undefined && this.app.options.server.sendtxs === 0) { this.sendtxs = 0; }
        if (this.app.options.server.sendgts !== undefined && this.app.options.server.sendgts === 0) { this.sendgts = 0; }
      }
    }

    if (this.app.options.peers != null) {
      for (let i = 0; i < this.app.options.peers.length; i++) {
        this.connectToPeer(JSON.stringify(this.app.options.peers[i]));
      }
    }

    this.app.connection.on('peer_disconnect', (peer) => {
      this.cleanupDisconnectedSocket(peer);
    });

    //keep trying to reconnect dead peers that matter to us.
    this.peer_monitor_timer = setInterval(() => { this.pollPeers(this.app.network.peers, this.app) }, this.peer_monitor_timer_speed);

  }


  pollPeers(peers, app) {

    var this_network = app.network;

    //
    // loop through peers to see if disconnected
    //
    peers.forEach((peer) => {

      //
      // if disconnected, cleanupDisconnectedSocket
      //
      if (!peer.socket.connected) {
        if (!this.dead_peers.includes(peer)) {
          this.cleanupDisconnectedSocket(peer);
        }
      }
    });

    //console.log('dead peers to add: ' + this.dead_peers.length);
    // limit amount of time nodes spend trying to reconnect to
    // prevent ddos issues.
    var peer_add_delay = this.peer_monitor_timer_speed - this.peer_monitor_connection_timeout;
    this.dead_peers.forEach((peer) => {
      setTimeout(() => { this_network.connectToPeer(JSON.stringify(peer)) }, peer_add_delay);
    });
    this.dead_peers = [];
  }



  cleanupDisconnectedSocket(peer) {

    for (let c = 0; c < this.peers.length; c++) {
      if (this.peers[c] == peer) {

        var keep_peer = -1;

        //
        // do not remove peers we asked to add
        //
        if (this.app.options.peers != null) {
          for (let d = 0; d < this.app.options.peers.length; d++) {
            if (this.app.options.peers[d].host == peer.peer.host && this.app.options.peers[d].port == peer.peer.port) {
              keep_peer = d;
            }
          }
        }

        //
        // do not remove peers if it's end point is in our options
        //
        if (this.app.options.peers != null && typeof peer.peer.endpoint != 'undefined') {
          for (let d = 0; d < this.app.options.peers.length; d++) {
            if (this.app.options.peers[d].host == peer.peer.endpoint.host && this.app.options.peers[d].port == peer.peer.endpoint.port) {
              keep_peer = d;
            }
          }
        }

        //
        // do not remove peers serving dns
        //
        if (this.app.options.peers != null) {
          if (this.app.options.dns != null) {
            for (let d = 0; d < this.app.options.dns.length; d++) {
              if (this.app.options.dns[d].host == peer.peer.host && this.app.options.dns[d].port == peer.peer.port) {
                keep_peer = d;
              }
            }
          }
        }

        if (keep_peer >= 0) {
	  //
	  // we push onto dead peers list, which will
	  // continue to try and request a connection
	  //
          this.dead_peers.push(this.app.options.peers[keep_peer]);
        }

        //
        // close and destroy socket, and stop timers
        //
        this.peers[c].deletePeer();
        this.peers.splice(c, 1);
        c--;
        this.peers_connected--;

      }
    }
  }


  connectToPeer(peerjson) {

    let peerhost = "";
    let peerport = "";

    let peerobj = {};
    peerobj.peer = JSON.parse(peerjson);

    if (peerobj.peer.protocol == null) { peerobj.peer.protocol = "http"; }
    if (peerobj.peer.host != undefined) { peerhost = peerobj.peer.host; }
    if (peerobj.peer.port != undefined) { peerport = peerobj.peer.port; }

    //
    // no duplicate connections
    //
    for (let i = 0; i < this.peers.length; i++) {
      if (this.peers[i].peer.host == peerhost && this.peers[i].peer.port == peerport) {
        console.log("already connected to peer...");
        return;
      }
    }

    //
    // do not connect to ourselves
    //
    if (this.app.options.server != null) {
      if (peerhost == "localhost") { return; }
      if (this.app.options.server.host == peerhost && this.app.options.server.port == peerport) {
        console.log("ERROR 185203: not adding " + this.app.options.server.host + " as peer since it is our server.");
        return;
      }
      if (this.app.options.server.endpoint != null) {
        if (this.app.options.server.endpoint.host == peerhost && this.app.options.server.endpoint.port == peerport) {
          console.log("ERROR 185204: not adding " + this.app.options.server.host + " as peer since it is our server.");
          return;
        }
      }
    }

    //
    // create peer and add it
    //
    let peer = new saito.peer(this.app, JSON.stringify(peerobj));

    //
    // we connect to them
    //
    peer.connect(0);
    this.peers.push(peer);
    this.peers_connected++;

console.log("connect to peer...");

  }



  addRemotePeer(socket) {

    // deny excessive connections
    if (this.peers_connected >= this.peers_connected_limit) {
      console.log("ERROR 757594: denying request to remote peer as server overloaded...");
      return;
    }

    //
    // sanity check
    //
    for (let i = 0; i < this.peers.length; i++) {
      if (this.peers[i].socket_id == socket.id) {
        console.log("error adding socket: already in pool");
        return;
      }
    }


    //
    // add peer
    //
    let peer = new saito.peer(this.app);
    peer.socket = socket;
    //
    // they connected to us
    //
    peer.connect(1);
    this.peers.push(peer);
    this.peers_connected++;

  }


  propagateBlock(blk) {

    if (this.app.BROWSER == 1) { return; }
    if (blk == null) { return; }
    if (blk.is_valid == 0) { return; }

    var data = { bhash: blk.returnHash(), bid: blk.block.id };
    for (let i = 0; i < this.peers.length; i++) {
      if (this.peers[i].handshake_completed == 1) {
        if (this.peers[i].peer.sendblks == 1) {
          this.peers[i].sendRequest("block", data);
        }
      }
    }

  }


  propagateTransaction(tx, outbound_message = "transaction", mycallback = null) {

    if (tx == null) { return; }
    if (!tx.is_valid) { return; }
    if (tx.transaction.type == 1) { outbound_message = "golden ticket"; }

    //
    // if this is our (normal) transaction, add to pending
    //
    if (tx.transaction.from[0].add == this.app.wallet.returnPublicKey()) {
      this.app.wallet.addTransactionToPending(tx);
      this.app.connection.emit("update_balance", this.app.wallet);
    }

    if (this.app.BROWSER == 0 && this.app.SPVMODE == 0) {

      //
      // is this a transaction we can use to make a block
      //
      if (this.app.mempool.containsTransaction(tx) != 1) {

        //
        // return if we can create a transaction
        //
        if (!this.app.mempool.addTransaction(tx)) {
          console.error("ERROR 810299: balking at propagating bad transaction");
          console.error("BAD TX: " + JSON.stringify(tx.transaction));
          return;
        }
        if (this.app.mempool.canBundleBlock() == 1) {
          return 1;
        }
      }
    }


    //
    // whether we propagate depends on whether the fees paid are adequate
    //
    let fees = tx.returnFees(this.app);
    for (let i = 0; i < tx.transaction.path.length; i++) { fees = fees / 2; }
    this.sendTransactionToPeers(tx, outbound_message, fees, mycallback);

  }


  propagateOffchainTransaction(tx, outbound_message = "offchain transaction", mycallback = null) {

    if (tx == null) { return; }
    if (!tx.is_valid) { return; }

    //
    // whether we propagate depends on whether the fees paid are adequate
    //
    let fees = tx.returnFees(this.app);
    for (let i = 0; i < tx.transaction.path.length; i++) { fees = fees / 2; }
    this.sendTransactionToPeers(tx, outbound_message, fees, mycallback);

    this.peers.forEach((peer) => {
      if (!peer.inTransactionPath(tx) && peer.returnPublicKey() != null) {
        let tmptx = peer.addPathToTransaction(tx);
        peer.sendTransaction(outbound_message, JSON.stringify(tmptx.transaction));
      }
    });

  }


  sendTransaction(message, data = "", fee = 1) {
    for (let x = this.peers.length - 1; x >= 0; x--) {
      if (this.peers[x].peer.receivetxs == 1) {
        this.peers[x].sendRequest(message, data);
      }
    }
  }

  sendPeerRequest(message, data = "", peer) {
    for (let x = this.peers.length - 1; x >= 0; x--) {
      if (this.peers[x] == peer) {
	this.peers[x].sendRequest(message, data);
      }
    }
  }
  sendRequest(message, data = "") {
    for (let x = this.peers.length - 1; x >= 0; x--) {
      this.peers[x].sendRequest(message, data);
    }
  }

  sendRequestWithCallback(message, data = "", callback) {
    for (let x = this.peers.length - 1; x >= 0; x--) {
      this.peers[x].sendRequestWithCallback(message, data, callback);
    }
  }

  sendTransactionToPeers(tx, outbound_message, fees = 1, callback = null) {

    this.peers.forEach((peer) => {
      //&& fees >= peer.peer.minfee

      if (peer.peer.receivetxs == 0) {
        return;
      }
      if (!peer.inTransactionPath(tx) && peer.returnPublicKey() != null) {
        let tmptx = peer.addPathToTransaction(tx);
        if (callback) {
          peer.sendRequestWithCallback(outbound_message, JSON.stringify(tmptx.transaction), callback);
        } else {
          peer.sendRequest(outbound_message, JSON.stringify(tmptx.transaction));
        }
      }
    });
  }


  propagateTransactionWithCallback(tx, mycallback = null) {
    this.propagateTransaction(tx, "transaction", mycallback);
  }


  //
  // BLOCK FETCHING

  /**
   * Add block hash to downloads queue based on peer. Updates download hashmap to track blocks in queue
   *
   * @param {saito.peer} peer who we're getting our block from
   * @param {string} bhash block hash
   */
  addBlockHashToQueue(peer, bhash) {

    //
    // avoid dupes
    //
    if (this.app.blockchain.isHashIndexed(bhash) == 1) {
      return;
    }
    if (this.downloads_hmap[bhash] == 1) {
      return;
    }

    let peer_publickey = peer.returnPublicKey();

    if (this.downloads[peer_publickey] == null) {
      this.downloads[peer_publickey] = [];
      this.downloads[peer_publickey].push(bhash)
    } else {
      this.downloads[peer_publickey].push(bhash)
    }
    this.downloads_hmap[bhash] = 1;
  }


  /**
   * Fetches blocks in our download queue then processes downloaded blocks
   */
  async fetchBlocks() {

    //
    // blocks are already downloading
    //
    if (this.downloading_active == 1) { return; }

    try {

      this.downloading_active = 1;

      //
      // for each peer, we loop through all outstanding blocks and make
      // our request. Note that we do NOT use .map to make these download
      // requests as that pulls them entirely out of order...
      //
      for (var key in this.downloads) {

        let peer = this.app.network.returnPeerByPublicKey(key)
        if (peer != null) {
          while (this.downloads[key].length > 0) {
            for (let d = 0; d < this.downloads[key].length && d != -1;) {
              let mypkey = this.app.wallet.returnPublicKey();
              let block_to_download_url = peer.returnBlockURL(this.downloads[key][d]);

	      if (block_to_download_url.indexOf("localhost") > -1 && this.app.BROWSER == 0) {
                console.log("ERROR 482039: network misconfiguration trying to download from myself - peer as localhost");
                this.downloads[key].shift();
                this.downloading_active = 0;
	      } else {

                try {
                  await this.fetchBlock(`${block_to_download_url}/${this.downloads[key][d]}/${mypkey}`, this.downloads[key][d]);
                  this.downloads[key].shift();
                } catch (err) {
                  if (err == -1) {
                    //
                    // network is down
                    //
                    console.log("error downloading block... network down");
                    this.downloading_active = 0;
                    return;
                  } else {
                    //
                    // network is up, but file is off
                    //
                    console.log("error downloading block... network up (remove block)");
                    console.log("err: " + JSON.stringify(err));
                    this.downloads[key].shift();
                    this.downloading_active = 0;
                  }
                }
	      }
            }
          }
        }

        delete this.downloads[key];
      }

    } catch (err) {

console.log("ERROR 852034: error downloading blocks from peer");

    }
console.log("and out...downloading set tozero");
    this.downloading_active = 0;
    this.app.mempool.processBlockQueue();
  }



  /**
   * Fetches single block from endpoint
   *
   * @param {URL} block_to_download_url url endpoint to GET block
   * @param {string} bhash block hash of fetched block
   **/
  async fetchBlock(block_to_download_url, bhash) {
    return new Promise((resolve, reject) => {
      fetch(block_to_download_url, {})
        .then(response => {
          if (response.status !== 200) {
            console.log('ERROR FETCHING BLOCK 11111. Status Code: ', response.status);
            reject(200);
          } else {
            response.text().then(data => {
              let blkobj = this.app.storage.convertBlockStringToHeadersAndTransactionsJSON(data);
              let blk = new saito.block(this.app, JSON.parse(blkobj.headers));
              for (let i = 0; i < blkobj.transactions.length; i++) {
                blk.transactions.push(new saito.transaction(JSON.parse(blkobj.transactions[i])));
              }
              this.app.mempool.addBlock(blk);
              delete this.downloads_hmap[bhash];
              resolve();
            });
          }
        })
        .catch((err) => {
          console.log('Fetch Error :-S', err);
          reject(-1);
        });
    });
  }


  returnPeerByPublicKey(publickey) {
    for (let i = 0; i < this.peers.length; i++) {
      let peer = this.peers[i];
      if (peer.peer.publickey == publickey) {
        return peer;
      }
    }
    return null;
  }


  isPrivateNetwork() {
    for (let i = 0; i < this.peers.length; i++) { if (this.peers[i].isConnected()) { return false; } }
    if (this.app.options.peers != null) { return false; }
    return true;
  }

  isProductionNetwork() {
    if (this.app.BROWSER === 0) {
      return process.env.NODE_ENV === 'prod'
    } else {
      return false
    }
  }

  isConnected() {
    for (let k = 0; k < this.peers.length; k++) {
      if (this.peers[k].isConnected() == 1) { return 1; }
    }
    return 0;
  }

  hasPeer(publickey) {
    for (let k = 0; k < this.peers.length; k++) {
      if (this.peers[k].returnPublicKey() == publickey) return true
    }
    return false
  }

  close() {
    console.log('closing network connections');
    for (let i = 0; i < this.peers.length; i++) {
      if (this.peers[i].socket) {
        delete this.peers[i].socket;
      }
    }
    return;
  }

}


module.exports = Network;
