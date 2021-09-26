module.exports = Web3Template = (app) => {
    return `
    <div class="web3-page">
      <div class="web3-heading">
        <div class="left">
          <h1>Play <span class="heading-poker">Poker</span></h1>
          <h2>with Westend Coins</h2>
          <div class="powered-by">
            <div class="powered">powered by</div>
            <div class="powered-logo"><img src="/saito/img/logo.svg" /></div>
          </div>
        </div>
        <div class="right">
          <img src="/subpagestyle/web3/poker_cards.png" />
        </div>
      </div>
      <h3 class="page-heading">Before you can start a game,<br />
      you'll need to get some <a href="">WND</a>.</h3>
      <div class="page-content">
        <p>You already have a new <b>Westend wallet</b> running in this webpage. Under the menu on the top right you should see your <b>Westend address</b>. 
        </p>
        <p><span class="the-button"><a class="button" href="">Visit the faucet</a></span> and get some tokens sent to your address.
        </p>
        <p>After you get your tokens, you should see your balance by visiting <a href="">this block explorer link</a> or by refreshing this page and checking your balance in the sidebar menu below your address.
        </p>
        <p class="flex">After you confirm your balance you can visit the <a href="/arcade" class="arcade-button"><img src="/website/img/top_logo.png" class="saito-logo" />  <span class="sep">|</span> <span class="arcade">Arcade</span></a> to start a game.</p> 
        <p>Look for a <b>poker invite using Westend</b> or <b>start your own game</b> by clicking Poker on the left, choosing <b>advanaced options</b>, and selecting <b>WND</b> under the Token dropdown.
        </p>
      </div>
    </div>`;
  }
  