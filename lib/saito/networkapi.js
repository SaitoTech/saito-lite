const saito = require('./saito');
const fetch = require('node-fetch');
const { set } = require('numeral');
const Base58 = require("base-58");
const secp256k1 = require('secp256k1');

const blake3 = require('blake3');

const Big = require('big.js');

let TRANSACTION_SIZE = 89;
let SLIP_SIZE = 75;
let HOP_SIZE = 130;
let BLOCK_HEADER_SIZE = 213;

/**
 * An APIMessage
 * @typedef {Object} APIMessage
 * @property {array} command - The name of the command(remote procedure)
 * @property {number} index - The index of the API call, similar to JSON RPC's id.
 * @property {array} raw_message - the data being send to the remote procedure
 */

/**
 * A handshake Challenge
 * @typedef {Object} HandshakeChallenge
 * @property {array} their_ip_octets - four numbers representing an IP(v4)
 * @property {array} my_ip_octets - four numbers representing an IP(v4)
 * @property {string} their_address - a pubkey(hex)
 * @property {string} my_address - a pubkey(hex)
 * @property {Big} timestamp - unix timestamp of the challenge
 * @property {array} their_sig - bytes
 */

/**
 * A Block
 * @typedef {Object} Block
 * TODO
 */

/**
 * A Transaction
 * @typedef {Object} Transaction
 * TODO
 */

/**
 * A Slip
 * @typedef {Object} Slip
 * TODO
 */

/**
 * A Hop
 * @typedef {Object} Hop
 * TODO
 */

/**
 * This class provides functions for interacting with other nodes. It wraps
 * the low level socket/http functionality with higher-level functions
 * which can be passed things like a socket or binary data to process them
 * into JS objects or wrap the socket in async functions for easier integration.
 */
class NetworkAPI {
  /**
   * 
   * @param {Object} app - the app Object. a catchall for global
   */
  constructor(app) {
      this.app = app;
      this.api_call_index = 0;
      this.api_callbacks = {};
  }
  /**
   * Initialization function. Sometimes needed if constructor is too early, i.e.
   * other parts of the system may not be ready yet.
   */
  initialize() {
    // Demo of how to connect to Rust here:
    // Disabling these, they are not meant to be shipped.
    //if (!this.app.BROWSER) {
console.log("Connect to Rust client!");
       this.wsConnectToRustPeer();
console.log("Connect to Rust client!");
       this.getDemoBlockFromRust();
console.log("Connect to Rust client!");
    //}
  }

  /**
   * Converts from big-endian binary encoded u64(from the wire)
   * into a Big number.
   * @param {Array} bytes - array of bytes
   * @returns Big
   */
  u64FromBytes(bytes) {
    let top = new Big(this.u32FromBytes(bytes.slice(0,4)));
    let bottom = new Big(this.u32FromBytes(bytes.slice(4,8)));
    let max_u32 = new Big(4294967296);
    return (top.times(max_u32)).plus(bottom);
  }
  /**
   * Converts from a JS Number, treated as an integery, into
   * a big-endian binary encoded u32(for the wire)
   * @param {Big} bigValue - Big
   * @returns array of bytes
   */
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
  /**
   * Converts from big-endian binary encoded u64(from the wire)
   * into a JS Number(as an integer).
   * @param {array} bytes - array of 4 bytes
   * @returns number
   */
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

  /**
   * Converts from a JS Number, treated as an integer, into
   * a big-endian binary encoded u32(for the wire)
   * @param {number} val 
   * @returns array of 4 bytes
   */
  u32AsBytes(val){
    var bytes = [];
    var i = 4;
    do {
      bytes[--i] = val & (255);
      val = val>>8;
    } while ( i )
    return bytes;
  }
  /**
   * Converts from a u8 byte(from the wire)
   * into a JS Number(as an integer).
   * @param {Uint8} byte 
   * @returns number
   */
  u8FromByte(byte) {
    return 0 + byte;
  }

  /**
   * Converts from a JS Number into big-endian binary encoded
   * u8(for the wire)
   * @param {number} val 
   * @returns byte
   */
  u8AsByte(val){
    return val & (255);
  }
  
  /**
   * Async function. A simple mechanism for managing responses to messages sent over the socket.
   * Will keep track of the call index and automatically call resolve/response with a RESULT__
   * is sent back.
   * 
   * @param {WebSocket} ws - a websocket
   * @param {array} command - 8-byte Array - the API command(remote procedure)
   * @param {array} message_bytes - byte Vector - the message to be passed to the procedure.
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
   * When an API is received with special command "RESULT__", this
   * function is called and automatically dispatches the returned 
   * data to the appropriate resolve().
   * @private
   * @param {array} bytes
   */
  receiveAPIResponse(api_message) {
    if(this.api_callbacks[api_message.index]) {
      this.api_callbacks[api_message.index].resolve(api_message.raw_message);
    } else {
      throw "response callback not found";
    }
  }
  /**
   * When an API is received with special command "ERROR___", this
   * function is called and automatically dispatches the returned 
   * data to the appropriate reject().
   * @private
   * @param {array} bytes vector
   */
  receiveAPIError(bytes) {
    let index = this.u32FromBytes(bytes.slice(8,12));
    if(this.api_callbacks[index]) {
      this.api_callbacks[index].reject(bytes.slice(12));
    } else {
      throw "error callback not found";
    }
  }
  /**
   * Creates a bytes array ready for the wire representing an API call.
   * @param {array} command - the remote prodecure to call
   * @param {number} index - the index of this call, similar to JSON RPC's "id"
   * @param {array} data - data to be sent
   * @returns array - bytes for the wire
   */
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
  /**
   * Creates an APIMessage Object from bytes sent over the wire
   * 
   * @param {Uint8Array} bytes - raw bytes from the wire
   * @returns APIMessage
   */
  deserializeAPIMessage(bytes) {
    return {
      command: `${bytes.slice(0,8)}`,
      index: this.u32FromBytes(bytes.slice(8,12)),
      raw_message: bytes.slice(12)
    }
  }
  /**
   * Deserialize handshake challenge from the wire
   * @param {array} buffer - raw bytes
   * @returns {HandshakeChallenge}
   */
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

/**
 * Serialize Block
 * @param {Block} block
 * @returns {array} - raw bytes
 */
  serializeBlock(block) {
    let transactions_length = this.u32AsBytes(block.transactions.length);
    let id = this.u64AsBytes(block.id);
    let timestamp = this.u64AsBytes(block.timestamp);
    let previous_block_hash = Buffer.from(block.previous_block_hash, 'hex');
    let creator = Buffer.from(block.creator, 'hex');
    let merkle_root = Buffer.from(block.merkle_root, 'hex');
    let signature = Buffer.from(block.signature, 'hex');
    let treasury = this.u64AsBytes(block.treasury);
    let staking_treasury = this.u64AsBytes(block.staking_treasury);
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
      ...staking_treasury,
      ...burnfee,
      ...difficulty,
    ]);

    let total_tx_length = 0;
    let transactions = [];
    for(let i = 0; i < block.transactions.length; i++) {
      let next_tx_data = this.serializeTransaction(block.transactions[i]);
      total_tx_length += next_tx_data.length;
      transactions.push(next_tx_data);
    }

    let ret = new Uint8Array(BLOCK_HEADER_SIZE + total_tx_length);
    ret.set(block_header_data, 0);
    let next_tx_location = BLOCK_HEADER_SIZE;
    for(let i = 0; i < transactions.length; i++) {      
      ret.set(transactions[i], next_tx_location);
      next_tx_location += transactions[i].length;
    }

    return ret;
  }
  /**
   * deserialize block
   * @param {array} buffer - 
   * @returns {Block}
   */
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
    block.staking_treasury = this.u64FromBytes(buffer.slice(189, 197));
    block.burnfee = this.u64FromBytes(buffer.slice(197, 205));
    block.difficulty = this.u64FromBytes(buffer.slice(205, 213));
    let start_of_transaction_data = BLOCK_HEADER_SIZE;
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
/**
 * Serialize TX
 * @param {TransactionV2} transaction 
 * @returns {array} raw bytes
 */
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
        transaction_type]),
    0);

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
/**
 * Deserialize Transaction
 * @param {array} buffer - raw bytes, perhaps an entire block
 * @param {number} start_of_transaction_data - where in the buffer does the tx data begin
 * @returns {Transaction}
 */
  deserializeTransaction(buffer, start_of_transaction_data) {
    let inputs_len = this.u32FromBytes(buffer.slice(start_of_transaction_data, start_of_transaction_data + 4));
    let outputs_len = this.u32FromBytes(buffer.slice(start_of_transaction_data + 4, start_of_transaction_data + 8));
    let message_len = this.u32FromBytes(buffer.slice(start_of_transaction_data + 8, start_of_transaction_data + 12));
    let path_len = this.u32FromBytes(buffer.slice(start_of_transaction_data + 12, start_of_transaction_data + 16));

    let signature = this.app.crypto.stringToHex(buffer.slice(start_of_transaction_data + 16, start_of_transaction_data + 80));
    let timestamp = this.u64FromBytes(buffer.slice(start_of_transaction_data + 80, start_of_transaction_data + 88));
    let transaction_type = buffer[start_of_transaction_data + 88];
    let start_of_inputs = start_of_transaction_data + TRANSACTION_SIZE;
    let start_of_outputs = start_of_inputs + inputs_len * SLIP_SIZE;
    let start_of_message = start_of_outputs + outputs_len * SLIP_SIZE;
    let start_of_path = start_of_message + message_len;

    let inputs = [];
    for (let i = 0; i < inputs_len; i++) {
      let start_of_slip = start_of_inputs + (i * SLIP_SIZE);
      let end_of_slip = start_of_slip + SLIP_SIZE;
      let input = this.deserializeSlip(buffer.slice(start_of_slip, end_of_slip));
      inputs.push(input);
    }
    let outputs = [];
    for (let i = 0; i < outputs_len; i++) {
      let start_of_slip = start_of_outputs + (i * SLIP_SIZE);
      let end_of_slip = start_of_slip + SLIP_SIZE;
      let input = this.deserializeSlip(buffer.slice(start_of_slip, end_of_slip));
      outputs.push(input);
    }
    let message = buffer.slice(start_of_message, start_of_message + message_len);
    
    let path = [];
    for (let i = 0; i < path_len; i++) {
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
  /**
   * Serialize Slip
   * @param {Slip} slip 
   * @returns {array} raw bytes
   */
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
  /**
   * Deserialize Slip
   * @param {array} buffer 
   * @returns {Slip}
   */
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
  /**
   * Serialize Hop
   * @param {Hop} hop 
   * @returns {array} raw bytes
   */
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
    /**
   * Deserialize Hop
   * @param {array} buffer 
   * @returns {Hop}
   */
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
  // DEMO TEST FUNCTION, SHOULD BE REFACTORED
  async wsConnectToRustPeer() {
    const WebSocket = require('ws');
    const ws = new WebSocket('http://127.0.0.1:3000/wsopen');

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
  // DEMO TEST FUNCTION, SHOULD BE REFACTORED
  async getDemoBlockFromRust() {
    const fetch = require('node-fetch');
    try {
      const url = `http://127.0.0.1:3000/block/403fa38a30aa0028f3d7020c4856474eaaf4e6e9b8346142ee83624352ae069d`;
      const res = await fetch(url);
      if (res.ok) {
        const buffer = await res.buffer();
        let block = this.deserializeBlock(buffer);
        console.log(`GOT BLOCK ${block.id} ${block.timestamp}`)
      } else {
        console.log(`Error fetching block: Status ${res.status} -- ${res.statusText}`);
      }
    } catch(err) {
      console.log(`Error fetching block: ${err}`);
    }
  }
}


module.exports = NetworkAPI;
