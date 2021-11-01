const ModTemplate = require('../../lib/templates/modtemplate');
const MixinAppspace = require('./lib/mixin-appspace');

class MixinTest extends ModTemplate {

    constructor(app) {

        super(app);

        this.description = "Mixin Test"
        this.categories = "";

        this.name = "Mixin";
    }

    //    onConfirmation(blk, tx, conf, app) {
    //    }

    initialize(app) {
        //For testing only, no need to initialize module 
        super.initialize(app);

        if(app.BROWSER == 1 || this.browser_active == 1 ) {return;}

        const ClientConfig = require('../../config/mixin-credentials');
        const MixinClient = require('mixin-node-client');


        //const { MixinClient } = require('mixin-node-client');
        //const config = require('./config');

        const client = new MixinClient.HttpClient(ClientConfig);

        const recipientId = 'ca630936-5af6-427e-ac4a-864a4c64f372'; // UserId
        const senderId = '7701e7bf-2a86-4655-982e-023564fa8945'; // UserID
        const assetId = '965e5c6e-434c-3fa9-b780-c50f43cd955c'; // CNB

        (async () => {
            try {
              /*
             // asset related
              const assets = await client.getUserAssets();
              const asset = await client.getUserAsset(assetId);
              const topAssets = await client.getNetworkAssets();
              const topAsset = await client.getNetworkAsset(assetId);
              console.log({ assets, asset, topAssets, topAsset });
          
              // pin verify/update/create
              const verifyPin = await client.verifyPin(ClientConfig.assetPin);
              // const updatePin = await client.updatePin({ oldPin: config.assetPin, newPin: '123456' }); // CAUTION
              console.log({ verifyPin });
          
              // address/asset management (deposit & withdraw)
              const depositAddress = await client.deposit(assetId);
              const withdrawAddress = await client.createWithdrawAddress({
                assetId,
                label: 'Chui Niu Bi',
                publicKey: '0x4e088890f58dba45eb215613e9f01ed362ec87fb',
              });
              const addressList = await client.getWithdrawAddress(assetId);
              const withdrawResult = await client.withdraw({
                addressId: withdrawAddress.address_id,
                assetId,
                amount: 100,
                memo: 'test from mixin-node-client',
              });
          
              const deleteAddress = await client.deleteWithdrawAddress(withdrawAddress.address_id);
              console.log({ depositAddress, withdrawAddress, addressList, withdrawResult, deleteAddress });
          
              // transfer and payments
              const createTransfer = await client.createTransfer({
                assetId,
                recipientId: senderId,
                traceId: UUID,
                amount: '1',
                memo: 'Test',
              });
              const readTransfer = await client.getTransfer(UUID);
              const verifyPayment = await client.verifyPayment({
                assetId,
                recipientId: senderId,
                traceId: UUID,
                amount: '1',
              });
              console.log({ createTransfer, readTransfer, verifyPayment });
          
              // conversation & message
              const conversation = await client.createConversation({
                category: 'CONTACT',
                participants: [senderId],
              });
              const group = await client.createConversation({
                category: 'GROUP',
                participants: [senderId, recipientId],
                conversationId: UUID,
              });
              const message = await client.sendMessage({
                category: 'PLAIN_TEXT',
                conversationId: conversation.conversation_id,
                recipientId: senderId,
                data: Buffer.from('Hello from node.js new client sdk').toString('base64'),
              });
              console.log({ conversation, group, message });
          
              // snapshot
              const snapshots = await client.getSnapshots({ limit: 10, asset: assetId, offset: new Date().toString() });
              const snapshot = await client.getSnapshot(snapshots[0].snapshot_id);
              console.log({ snapshots, snapshot });
          
              // user profile/contacts
              const profile = await client.getProfile();
              const user = await client.getUser(senderId);
              const users = await client.getUsers([recipientId, senderId]);
              const friends = await client.getFriends();
              const contacts = await client.getContacts();
              console.log({ profile, friends, user, users, contacts });
          */
              const { generateKeyPairSync } = require('crypto');
              const { publicKey } = generateKeyPairSync('rsa', {
                modulusLength: 1024, // the length of your key in bits
                publicKeyEncoding: {
                  type: 'spki', // recommended to be 'spki' by the Node.js docs
                  format: 'pem',
                },
                privateKeyEncoding: {
                  type: 'pkcs1', // recommended to be 'pkcs8' by the Node.js docs
                  format: 'pem',
                  // cipher: 'aes-256-cbc',   // *optional*
                  // passphrase: 'top secret' // *optional*
                },
              });
              const publicKey1 = publicKey.replace('-----BEGIN PUBLIC KEY-----', '');
              const publicKey2 = publicKey1.replace('-----END PUBLIC KEY-----', '');
              const publicKey3 = publicKey2.replace(/\r?\n|\r/g, '');
          
              const info = await client.createUser({
                full_name: 'bitcoin wallet',
                session_secret: publicKey3,
              });
              console.log(info);
              
            } catch (err) {
              console.error('error', err);
              console.trace(err);
            }
          })();

    }

    respondTo(type) {

      if (type == 'email-appspace') {
        let obj = {};
      obj.render = function (app, data) {
        MixinAppspace.render(app, data);
            }
      obj.attachEvents = function (app, data) {
        MixinAppspace.attachEvents(app, data);
      }
        return obj;
      }
  
      return null;
    }

    async handlePeerRequest(app, message, peer, callback) {
        /*    if (message.request == "send email") {
                let email = {};
                email.to = message.data.to;         //email address as string
                if (typeof (message.data.from) != "undefined" && message.data.from != "") {
                    email.from = message.data.from;       //email address as string
                } else {
                    email.from = "network@saito";
                }
                email.subject = message.data.subject;    //email subject as string
                email.cc = message.data.cc;         //cc addresses as array of strings
                email.bcc = message.data.bcc;        //bcc addresses as array of strings
                if (message.data.ishtml) {               //html email content flag - defaults to no.
                    email.html = message.data.body;
                } else {
                    email.text = message.data.body;
                }
                email.attachments = message.data.attachments;  //array of attahments in formats as defined here
                // ref: https://github.com/guileen/node-sendmail/blob/master/examples/attachmentFile.js
    
                try {
                    this.sendMail(email);
                } catch(err) {
                    console.err(err);
                }
            } */
    }




    shouldAffixCallbackToModule() { return 1; }

}

module.exports = MixinTest;
