import QRCode from './qrcode';
import { WalletTemplate ***REMOVED*** from './wallet.template.js';

export default class WalletUI {
***REMOVED***
        this.id = "bearguy@saito";
        this.balance = app.saito.wallet.wallet.balance;
        this.address = app.saito.wallet.returnPublicKey();
        this.qrcode = {***REMOVED***;

        return this;
***REMOVED***

    render() {
        let wallet = WalletTemplate(this);
        let main = document.querySelector('.main');
        main.innerHTML = wallet;

        this.qrcode = this.generateQRCode(this.address);
***REMOVED***

    generateQRCode(data) {
        return new QRCode(
            document.getElementById("qrcode"),
            data
        );
***REMOVED***
***REMOVED***
