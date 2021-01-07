const ModTemplate = require('../../lib/templates/modtemplate');
const nodemailer = require("nodemailer");
const credentials =  require('./lib/credentials');


class MailRelay extends ModTemplate {

    constructor(app) {
        super(app);

        this.description = "Module to relay Saito email messages onto the legacy email system."
        this.categories  = "Communications Utilities";

        this.name = "MailRelay";
	this.deascription = "Adds support for integrating on-chain messages with legacy off-chain email notifications";
	this.categories = "Core Utilities";
      }

    onConfirmation(blk, tx, conf, app) {
    }

    initialize(app) {
     //For testing only, no need to initialize module 
        super.initialize(app);

        // add an email

        let email = {};
        email.to      = 'richard@saito.tech';
        email.from    = 'network@saito.tech';
        email.bcc = "";
        email.subject = 'Saito Network Initialised';
        email.text = 'Just a quick note to let you know that test net just spun up.';
        email.ishtml = false;
        email.attachments = "";
        try {
            this.sendMail(email)
        } catch(err) {
            console.log(err);
        } 
        
    }

    async handlePeerRequest(app, message, peer, callback) {
        if (message.request == "send email") {
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
        }
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
