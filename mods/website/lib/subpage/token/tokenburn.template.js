module.exports = TokenTemplate = () => {
  return `
  <div class="">
    <div class="title">How to burn your ERC-20 SAITO in exchange for Native SAITO</div>
    <p>
      By burning your ERC-20 SAITO, it's possible to swap to Native Saito.
    </p>
    <p>
      In the burn function of our ERC-20 token, the data field of the burn function should be used to provide a valid SAITO native address in base-58 format.
    </p>
    <p>
      If you're using MyEtherWallet, you'll need to provide the ABI, which can be found <a href="https://github.com/SaitoTech/saito-evm-token/tree/master/deployments/live-0xFa14Fa6958401314851A17d6C5360cA29f74B57B">in the ERC20 github project in the deployments directory</a>. Detailed instructions for burning via MEW can be found <a href="https://github.com/SaitoTech/saito-evm-token/blob/master/README.md">in the README</a>.
    </p>
    <p>
      The ABI has also been uploaded to Etherscan and the burn() function can be accessed via their writeContract interface <a href="https://etherscan.io/token/0xFa14Fa6958401314851A17d6C5360cA29f74B57B#writeContract">here</a>.
    </p>
    <p>
      Please consider reaching out to the team at info@saito.tech before proceeding. We may have other means to help you with what you're trying to accomplish.
    </p>
  </div>  
  `;
}
