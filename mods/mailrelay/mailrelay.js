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

    sendMail (to, from, subject, message, attachments){
        let transporter = nodemailer.createTransport({
            sendmail: true,
            newline: 'unix'
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