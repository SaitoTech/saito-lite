const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate.js');
const nodemailer = require("nodemailer");


class MailRelay extends ModTemplate {

    constructor(app) {
        super(app);
        this.app = app;
        this.name = "MailRelay";
    }

    onConfirmation(blk, tx, conf, app) {
        let txmsg = tx.returnMessage();
        if (conf == 0) {
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
        let to      = 'richard@saito.tec';
        let from    = 'testnet@saito.io';
        let subject = 'This is a test email sent by the MailRelay module.';
        let message = 'This is a plain text email \n Very plain.';
        let attachments = "";
        try {
            this.sendMail(to, from, subject, message, attachments);
        } catch(err) {
            console.log(err);
        }
      }

    sendMail (to, from, subject, message, attachments){
        nodemailer.createTransport({
            host: "smtp.sendgrid.net",
            port: 587,
            secure: true, // upgrade later with STARTTLS
            auth: {
              user: "apikey",
              pass: "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"
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
              }
          });
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

}


module.exports = MailRelay;

