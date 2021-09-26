module.exports = ModalSelectCryptoTemplate = (app, cryptomod) => {

  return `  
    <div class="modal-select-crypto">
      ${cryptomod.renderModalSelectCrypto(app, cryptomod)}
    </div>
  `;

}

