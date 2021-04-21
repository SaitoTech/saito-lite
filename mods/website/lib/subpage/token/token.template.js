module.exports = TokenTemplate = () => {
  
  let futureContent = {
    title: '<div class="title">SAITO\'s token has launched</div>',
    para1: "Following our successful IDO launched on PolkaStarter, SAITO is now available as a swappable ERC-20 Token on the Ethereum platform. Each ERC-20 SAITO represents a Native SAITO coin and is 1-to-1 convertible to native coins withheld on the native network by the Saito Team.",
    para2: "We are very excited to have passed this milestone and look forward to continuing to leverage our amazing community to bring Saito to the next level!",
    para3: 'Details of the token can be seen on Etherscan <a href="https://etherscan.io/token/0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF">here</a>, Coinmarketcap <a href="https://coinmarketcap.com/currencies/saito/">here</a>, and Coingecko <a href="https://www.coingecko.com/en/coins/saito">here</a>.',
    para4: "In order to receive and hold your ERC-20 SAITO, you should use an ERC-20 compatible wallet such as MyEtherWallet or MetaMask.",
    para5: "We strongly encourage you to also consider a hardware-based solution for you key storage such as a Trezor or Ledger device.",
    para6: "Be sure not to use the SAITO smart contract token address as a receiving address!",
    para7: "Also be sure to keep a backup of your keys in a safe place.",
    para8: "The Saito Team will not be able to help you recover your funds if you keys are lost or otherwise irrecoverable.",
    para9: '<a id="burnlink" href="/website/tokenburn">Click here</a> for instructions on how to burn your ERC-20 SAITO in exchange for Native SAITO.',
    // para9 also needs to be wrapped in <p class="burninfo"></p>
  }
  
  let content = {
    title: "SAITO's token is launching in less than 48 hours",
    para1: "Our Polkastarter pool participants are KYC-ing now and the pool will open on April 22, 1PM UTC.",
    para2: "We will also be announcing the token address and creating a Uniswap pool directly following the IDO, so stay tuned to saito.io for more information as we proceed toward IDO day.",
    para3: "All private sale participants will also receive their tokens immediately following the IDO, subject to their vesting terms.",
    para4: "Thanks to everyone in the community for your enthusiatic support.",
  }
  if(document.location.host.includes("cn.saito.io")){
    content = {
      title: "SAITO代币将在未来48小时内上线。",
      para1: "我们的PolkaStarter Pool参与者现在正在进行KYC中，该池将于4月22日UTC下午1点开放。",
      para2: "我们还将在IDO之后宣布代币地址并直接创建一个Uniswap池，因此请继续关注saito.io获得更多信息，以继续进行IDO当天的活动。",
      para3: "参加ERC-20代币并完成KYC的所有私募参与者也将在IDO之后获得其代币。",
      para4: "感谢社区中每个人的大力支持",
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
  </div>`;
}
