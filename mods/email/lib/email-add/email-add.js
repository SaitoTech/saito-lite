const EmailAddTemplate = require('./email-add.template.js');

module.exports = EmailAdd = {
    email: {},
    render(email) {
        this.email = email;
        document.querySelector(".main").innerHTML = EmailAddTemplate();
        this.attachEvents();
    },

    attachEvents() {
        document.querySelector('.email-submit')
            .addEventListener('click', (e) => this.sendEmailTransaction());

    },

    sendEmailTransaction() {
        let saito = this.email.app;

        let email_title = document.querySelector('.email-title').value;
        let email_address = document.querySelector('.email-address').value;

        let email_fee = document.querySelector('.email-fee').value;
        let email_amount = document.querySelector('.email-amount').value;
        let email_text = document.querySelector('.email-text').value;

        let fee = parseInt(email_fee);
        let amt = parseInt(email_amount);

        let newtx = saito.wallet.createUnsignedTransaction(saito.wallet.returnPublicKey(), amt, fee);

        if (!newtx) {
          alert("Unable to send, please get tokens");
        }

        newtx.transaction.msg.module = "Email";
        newtx.transaction.msg.data  = email_text;
        newtx.transaction.msg.title  = email_title;
        newtx = saito.wallet.signTransaction(newtx);

        saito.network.propagateTransaction(newtx);
    }
}