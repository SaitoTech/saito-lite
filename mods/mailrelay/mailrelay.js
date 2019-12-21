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
        let txmsg = tx.returnMessage();
        if (conf == 0) {
            if (txmsg.module === "Email") {
                console.log("########################################Mail Relay###################################");
            }
            if (txmsg.module === "MailRelay") {
                this.sendMail(txmsg.to, txmsg.from, txmsg.subject, txmsg.message, txmsg.attachments);
            }
        }
    }

    initialize(app) {

        super.initialize(app);
    
        //
        // add an email
        //
        let to      = 'richard@saito.tech';
        let from    = 'testnet@saito.io';
        let subject = 'This is a test email sent by the MailRelay module.';
        let message = 'This is a plain text email \n Very plain.';
        let attachments = "";
        try {
            this.sendMail(to, from, subject, message, attachments)
        } catch(err) {
            console.log(err);
        }
      }

    sendMail (to, from, subject, message, attachments){
        let transporter = nodemailer.createTransport(credentials);
        transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: message,
            attachments: attachments  // ref: https://github.com/guileen/node-sendmail/blob/master/examples/attachmentFile.js            
        }, (err, info) => {
            console.log(info.envelope);
            console.log(info.messageId);
        });


    }

    shouldAffixCallbackToModule() { return 1; }

}

module.exports = MailRelay;
