module.exports = HowSaitoWorksTemplate = (app) => {
    return `
    <div class="how-saito-works-page">
        <h1 class="page-title">Welcome to the Saito Project</h1>
        <h2>What is Saito?</h2>
        <p>Saito is an open network that runs cryptocurrency applications in browsers without plugins, private APIs and non-open infrastructure. Saito survives without an owner while funding the nodes that provide user-facing infrastructure for its own network and other public blockchains.</p>
        <p>If you are new to Saito, you might enjoy our quick video introduction on <a href="https://www.youtube.com/watch?v=7LQQWOIeWSw">what problems Saito solves</a>. Or jump to trying out the network by visiting our community-driven <a href="/arcade">Saito Arcade</a>. For developers interested in building applications or adding support for other crypto cryptocurrencies, our developer section has technical information and tutorials that will get you started. And coding on Saito is really very easy: our introductory tutorial covering how to build and deploy your first application takes about five minutes to complete.</p>
        <p>The remainder of this site contains information on Saito’s mechanism design, economics and technical implementation. Because the problems that Saito solves are still poorly understood outside of actual economics, we recommend that those interested in learning how Saito works start with our overview of the <a href="https://org.saito.tech/economics">economic problems</a> that stand in the way of other scaling attempts. Once the basic economic problems can be seen, it is easier to understand why Saito makes the design decisions it does, as documented in our <a href="/saito-whitepaper.pdf">Saito whitepaper</a> and online repositories for <a href="https://github.com/saitotech/saito-lite">code and other network documentation</a>.</p>
    </div>`;
  }
  