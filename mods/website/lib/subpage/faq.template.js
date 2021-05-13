module.exports = FAQTemplate = (app) => {
  let html = "";
  const faq = [
    {
      q: 'What is Saito?', 
      a: 'Saito is a layer-one blockchain. The network is noteworthy for being more secure than Bitcoin while making payments not just to miners and stakers but also the nodes in the network that offer data-services to users in the network.'
    },
    {
      q: 'Why do we need another blockchain?',
      a: 'There are two market failures that affect every non-Saito blockchain: a tragedy of the commons problems that encourages blockchain bloat, and a free-rider problem that pushes up the cost of using the network. These problems get worse and worse as networks scale and costs rise. In order to have a truly-scalable public blockchain we need to fix these problems.'
    },
    {
      q: 'How does Saito solve the 51 percent attack?',
      a: 'Saito ensures that producing blocks is always expensive. Honest nodes pay those costs with the fees they collect from users. Attackers must pay out-of-pocket and are guaranteed to lose a quantifiable amount of money with each block they produce. There is no point at which this cost-of-attack falls below zero.'
    },
    {
      q: 'How does Saito solve the fifty-one percent attack?',
      a: 'Unless attackers match the amount of work done by the overall network, they either cannot produce blocks as quickly as honest nodes, or are able to produce blocks but not collect payments. Attackers must either go bankrupt or permit others to add work to their chain.'
    },
    {
      q: 'Surely there is a 51 percent attack in there somewhere?',
      a: 'No. Attackers who have a mere 50 percent of network resources lose about half their money each block. The cost-of-attack scales with the volume of network fees collected by others in the network.'
    },
    {
      q: 'How does transaction rebroadcasting work?',
      a: 'Saito uses a technique called Automatic Transaction rebroadcasting. This forces old transactions to compete with new ones for space on the blockchain. In market equilibrium the most profitable strategy for block producers is to ensure the same amount of data is deleted from the chain as is added each block.'
    }
  ];
  faq.forEach((qa, i) => {
    const checked = i == 0;
    html +=  `
    <section class="drop-down-menu">
      <input type="checkbox" class="activate" id="accordion-${i}" name="accordion-${i}" ${checked ? 'checked': ''}>
      <label for="accordion-${i}" class="menu-title">${qa.q}</label>
      <div class="drop-down">
        ${qa.a}
      </div>
    </section>`;
  })

  return `
    <div class="faq-page">
      <h1 class="page-title">Frequently Asked Questions</h1>
      <div class="faq-container menu">
        ${html}
      </div>
    </div>`;
}
  