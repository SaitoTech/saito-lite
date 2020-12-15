const WebsiteDataTemplate = require('./data.template');

module.exports = WebsiteData = {

  render(app) {

    if (document.querySelector('.netstats')) {
        document.querySelector('.netstats').innerHTML = WebsiteDataTemplate();
      }

    let bts = new Date(app.blockchain.last_ts);
    let lastBlockTime = bts.getHours() + ":" + ("0" + bts.getMinutes()).substr(-2) + ":" + ("0" + bts.getSeconds()).substr(-2);
    let lastBlockNumber = app.blockchain.last_bid;

    if (document.querySelector('.block-number')) {
      document.querySelector('.block-number').innerHTML = lastBlockNumber;
    }

    if (document.querySelector('.block-time')) {
        document.querySelector('.block-time').innerHTML = lastBlockTime;
      }

  }

}