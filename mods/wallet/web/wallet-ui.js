import QRCode from './qrcode';
import { WalletTemplate } from './wallet.template.js';

export default class WalletUI {
    constructor(app) {
        this.id = "bearguy@saito";
        this.balance = app.saito.wallet.wallet.balance;
        this.address = app.saito.wallet.returnPublicKey();
        this.qrcode = {};

        return this;
    }

    render() {
        let wallet = WalletTemplate(this);
        let main = document.querySelector('.main');
        main.innerHTML = wallet;

        this.qrcode = this.generateQRCode(this.address);
    }

    generateQRCode(data) {
        return new QRCode(
            document.getElementById("qrcode"),
            data
        );
    }
}
