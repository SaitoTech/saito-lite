const EmailAddTemplate = require('./email-add.template.js');
var numeral = require('numeral');

module.exports = EmailAdd = {
    email: {},
    render(email) {
        this.email = email;
        document.querySelector(".main").innerHTML = EmailAddTemplate();
        this.addData();
        this.attachEvents();
    },

    addData() {
        document.querySelector('.email-identifier').innerHTML = 'Address: ' + this.email.app.wallet.returnPublicKey();
        document.querySelector('.email-balance').innerHTML = numeral(this.email.app.wallet.returnBalance()).format('0,0.0000');
    },

    attachEvents() {
        document.querySelector('.email-submit')
            .addEventListener('click', (e) => this.sendEmailTransaction());

        document.querySelector('.raw-switch')
            .addEventListener('click', (e) => this.popluateRawMessage());            

    },

    sendEmailTransaction(newtx) {
        let saito = this.email.app;
        saito.network.propagateTransaction(newtx);
    },

    buildTransaction() {
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

        return newtx;
    },
     
    popluateRawMessage() {
        console.log('lets get raw');
        var txJson = JSON.stringify(this.buildTransaction(), null, 4);
        var r = document.querySelector('.raw-message');
        r.textContent = txJson;
        //r.addEventListener('change', this.verifyJSON, false);
        //document.addEventListener('onkeyup', this.verifyJSON, false);
        document.querySelector('.email-text').style.display = "none";
        document.querySelector('.raw-switch').style.display = "none";
        r.style.display = "block";
        r.onkeyup = () => { this.verifyJSON() };
        //r.onchange = this.verifyJSON(r);
    },

    verifyJSON() {
        var obj = document.querySelector('.raw-message');
        var str = obj.value;
            try {
                JSON.parse(str);
            } catch (e) {
                obj.style.background = "#FCC";
                obj.style.color = "red";
                return false;
            }
        obj.style.background = "#FFF";
        obj.style.color = "#000";
        return true;
    }


}