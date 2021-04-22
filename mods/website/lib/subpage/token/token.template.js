module.exports = TokenTemplate = () => {
  let content = {
    title: 'SAITO ERC-20 Token Contract',
    para1: 'The token\'s address is <a href="https://etherscan.io/token/0xFa14Fa6958401314851A17d6C5360cA29f74B57B">0xFa14Fa6958401314851A17d6C5360cA29f74B57B</a> and the Uniswap pair is <a href="https://info.uniswap.org/pair/0xdfcf744c8ae896e8631ba9b9dc717546646f6708">0xdfcf744c8ae896e8631ba9b9dc717546646f6708</a>.',
    para2: 'Details can be seen on <a href="https://etherscan.io/token/0xFa14Fa6958401314851A17d6C5360cA29f74B57B">Etherscan</a>, <a href="https://coinmarketcap.com/currencies/saito/">Coinmarketcap</a>, and <a href="https://www.coingecko.com/en/coins/saito">Coingecko</a>.',
    para2: "Following our successful IDO launched on PolkaStarter, SAITO is available as a swappable ERC-20 Token. Each ERC-20 SAITO represents a native SAITO coin and is 1-to-1 convertible to native coins withheld on the native network by the Saito Team.",
    para3: "SAITO can be traded on Uniswap and will soon also be available on more traditional platforms, so stay tuned for those announcements.",
    para4: "In order to receive and hold your ERC-20 SAITO, you should use an ERC-20 compatible wallet such as MyEtherWallet, MetaMask or TrustWallet.",
    para5: "We encourage you to consider a hardware-based solution for you key storage such as a Trezor or Ledger device. Also be sure to keep a backup of your keys in a safe place.",
    para6: "Also be careful not to use the token address as a receiving address!",
    para7: "Team Saito greatly appreciates your support. A blockchain is only as strong as it's community, we couldn't succeed without you.",
    para8: '<a id="burnlink" href="/website/tokenburn">Click here</a> for instructions on how to burn your ERC-20 SAITO in exchange for native SAITO.',
    class8 : "burninfo",
  }
  if(document.location.host.includes("cn.saito.io")){
    content = {      
      title: 'SAITO ERC-20 代币合约',
      para1: '代币地址为0xFa14Fa6958401314851A17d6C5360cA29f74B57B。 您可以在<a href="https://etherscan.io/token/0xFa14Fa6958401314851A17d6C5360cA29f74B57B">Etherscan</a>，<a href="https://coinmarketcap.com/currencies/saito/">Coinmarketcap</a>和<a href="https://www.coingecko.com/en/coins/saito">Coingecko</a>上查找详细信 息。',
      para2: "在PolkaStarter上成功进行IDO之后，SAITO将作为可交易的ERC-20代币使用。 每个ERC- 20 SAITO代表一个原生的SAITO代币，并且可以以1:1的比例转换为Saito主网上的原生代币。",
      para3: "SAITO可以在Uniswap上进行交易，并且很快还将在更多平台上线，敬请期待官方公告。",
      para4: "为了接收和持有ERC-20 SAITO，建议您使用与ERC-20兼容的钱包，例如 MyEtherWallet，MetaMask或TrustWallet。",
      para5: "我们鼓励您考虑基于硬件的钱包用于密钥存储，例如Trezor或Ledger。 另外，请务必将密 钥备份保存在安全的地方。",
      para6: "另外请注意不要将代币地址用作收款地址!",
      para7: "Saito团队非常感谢您的支持。 正因为社区，区块链才会如此强大，没有您我们就无法成功。",
      para8: '单击<a id="burnlink" href="/website/tokenburn">此处</a>获取有关如何将ERC-20 SAITO代币兑换成原生SAITO代币的说明。',
      class8 : "burninfo",
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
    <p class="${content.class8}">
      ${content.para8}
    </p>
  </div>`;
}
