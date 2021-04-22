module.exports = TokenTemplate = () => {
  
  let content = {
    title: '<div class="title">SAITO ERC-20 Token Contract</div>',
    para1: 'The token\'s address is 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF. Details can be seen on <a href="https://etherscan.io/token/0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF">Etherscan</a>, <a href="https://coinmarketcap.com/currencies/saito/">Coinmarketcap</a>, and <a href="https://www.coingecko.com/en/coins/saito">Coingecko</a>.',
    para2: "Following our successful IDO launched on PolkaStarter, SAITO is available as a swappable ERC-20 Token. Each ERC-20 SAITO represents a native SAITO coin and is 1-to-1 convertible to native coins withheld on the native network by the Saito Team.",
    para3: "SAITO can be traded on Uniswap and will soon also be available on more traditional platforms, so stay tuned for those announcements.",
    para4: "In order to receive and hold your ERC-20 SAITO, you should use an ERC-20 compatible wallet such as MyEtherWallet, MetaMask or TrustWallet.",
    para5: "We encourage you to consider a hardware-based solution for you key storage such as a Trezor or Ledger device. Also be sure to keep a backup of your keys in a safe place.",
    para6: "Also be careful not to use the token address as a receiving address!",
    para7: "Team Saito greatly appreciates your support. A blockchain is only as strong as it's community, we couldn't succeed without you.",
    para8: '<a id="burnlink" href="/website/tokenburn">Click here</a> for instructions on how to burn your ERC-20 SAITO in exchange for native SAITO.',
    id8 : "burnlink",
  }
  if(document.location.host.includes("cn.saito.io")){
    content = {
      title: '<div class="title">SAITO ERC-20 Token Contract</div>',
      para1: 'The token\'s address is 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF. Details can be seen on <a href="https://etherscan.io/token/0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF">Etherscan</a>, <a href="https://coinmarketcap.com/currencies/saito/">Coinmarketcap</a>, and <a href="https://www.coingecko.com/en/coins/saito">Coingecko</a>.',
      para2: "Following our successful IDO launched on PolkaStarter, SAITO is available as a swappable ERC-20 Token. Each ERC-20 SAITO represents a native SAITO coin and is 1-to-1 convertible to native coins withheld on the native network by the Saito Team.",
      para3: "SAITO can be traded on Uniswap and will soon also be available on more traditional platforms, so stay tuned for those announcements.",
      para4: "In order to receive and hold your ERC-20 SAITO, you should use an ERC-20 compatible wallet such as MyEtherWallet, MetaMask or TrustWallet.",
      para5: "We encourage you to consider a hardware-based solution for you key storage such as a Trezor or Ledger device. Also be sure to keep a backup of your keys in a safe place.",
      para6: "Also be careful not to use the token address as a receiving address!",
      para7: "Team Saito greatly appreciates your support. A blockchain is only as strong as it's community, we couldn't succeed without you.",
      para8: '<a id="burnlink" href="/website/tokenburn">Click here</a> for instructions on how to burn your ERC-20 SAITO in exchange for native SAITO.',
      id8 : "burnlink",
    }
  }
  return `
  <div>
    <div class="title">${content.title}</div>
    <p>
      ${content.para1}
    </p>
    <p>
      ${content.para2}
    </p>
    <p>
      ${content.para3}
    </p>
    <p>
      ${content.para4}
    </p>
    <p>
      ${content.para5}
    </p>
    <p>
      ${content.para6}
    </p>
    <p>
      ${content.para7}
    </p>
    <p id="${content.id8}">
      ${content.para8}
    </p>
  </div>`;
}
