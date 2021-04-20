module.exports = TokenTemplate = () => {
  
  let content = {
    title: "SAITO's token is launching in less than 48 hours",
    para1: "Our Polkastarter pool participants are KYC-ing now and the pool will open on April 22, 1PM UTC.",
    para2: "We will also be announcing the token address and creating a Uniswap pool directly following the IDO, so stay tuned to saito.io for more information as we proceed toward IDO day.",
    para3: "All private sale participants will also receive their tokens immediately following the IDO, subject to their vesting terms.",
    para4: "Thanks to everyone in the community for your enthusiatic support.",
  }
  if(document.location.host.includes("cn.saito.io") || true){
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
