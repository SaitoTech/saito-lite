const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate.js');
const nodemailer = require("nodemailer");
const credentials =  require('./lib/credentials');


class MailRelay extends ModTemplate {

    constructor(app) {
        super(app);

        this.name = "MailRelay";
    }

    onConfirmation(blk, tx, conf, app) {
    }

    initialize(app) {
    /* For testing only, no need to initialize module 
        super.initialize(app);

        // add an email

        let email = {};
        email.to      = 'richard@saito.tech';
        email.from    = 'testnet@saito.tech';
        email.bcc = "";
        email.subject = 'This is an updated test email sent by the MailRelay module.';
        email.body = 'This is a plain text email \n Very plain.';
        email.ishtml = false;
        email.attachments = "";
        try {
            this.sendMail(email)
        } catch(err) {
            console.log(err);
        } 
        */
    }

    async handlePeerRequest(app, message) {
        let email = {};
        email.to      = message.to;         //email address as string
        if (typeof(message.from) != "undefined" && message.from != "") {
            email.from    = message.from;       //email address as string
        } else {
            email.from = "testnet@saito";
        }
        email.subject = message.subject;    //email subject as string
        email.cc      = message.cc;         //cc addresses as array of strings
        email.bcc     = message.bcc;        //bcc addresses as array of strings
        if (message.ishtml) {               //html email content flag - defaults to no.
            email.html = message.body;
        } else {
            email.text = message.body; 
        }
        email.attachments = message.attachments;  //array of attahments in formats as defined here
        // ref: https://github.com/guileen/node-sendmail/blob/master/examples/attachmentFile.js
    }

    sendMail (email){
        let transporter = nodemailer.createTransport(credentials);
        transporter.sendMail(email, (err, info) => {
            if(info) {
                console.log(info.envelope);
                console.log(info.messageId);
            } else {
                console.log(err);
            }
        });

    }

    shouldAffixCallbackToModule() { return 1; }

}

module.exports = MailRelay;
