module.exports = FaucetAppspaceTemplate = (app) => {
  return `
  <link rel="stylesheet" href="/faucet/style.css">
  <div class="email-appspace-faucet">

    <div style="display: grid; grid-template-columns: 1fr 1fr;grid-gap: 1.5em;">
      <div class="faucet-emphasis">
        <h3>Register Username:</h3>
        <p>You should register a Saito username:</p>
      </div>

      <div class="faucet-emphasis">
        <h3>Backup Your Wallet:</h3>
        This will encrypt a copy of your wallet, and email it to your email address:
        <input type="text" placeholder="email@example.com" />
        <button style="margin-top:0.5em">backup wallet</button>
      </div>
    </div>

    <table class="faucet-bonuses">
      <tr>
        <td class="faucet-bonus-icon">
          <img src="/saito/img/logo-color.svg" />
        </td>
        <td class="faucet-bonus-text">
          Not a robot? It's not that we don't like robots, but we can't afford to keep paying them money and still have tokens for numans that want. That's why we're on the blacklist. But it also means you can fill out a captcha and get a bunch of tokens right away.
        </td>
      </tr>

      <tr>
        <td class="faucet-bonus-icon">
          <img src="/saito/img/logo-color.svg" />
        </td>
        <td class="faucet-bonus-text">
          Backup your wallet and we'll send you a heap of Saito tokens, enough to use the network for a long, long, time. Backing up your wallet is important as it provides you with the ability to restore your account.
        </td>
      </tr>

      <tr>
        <td class="faucet-bonus-icon">
          <img src="/saito/img/logo-color.svg" />
        </td>
        <td class="faucet-bonus-text">
          Install a new module. Saito supports installing new applications. Visit our appstore and install a new application and we will send you a large number of tokens.
        </td>
      </tr>

      <tr>
        <td class="faucet-bonus-icon">
          <img src="/saito/img/logo-color.svg" />
        </td>
        <td class="faucet-bonus-text">
          Share your experience with Saito on Twitter or Facebook. Whether positive or negative, we love all feedback. That's enough to keep using the network for a long time.
        </td>
      </tr>

      <tr>
        <td class="faucet-bonus-icon">
          <img src="/saito/img/logo-color.svg" />
        </td>
        <td class="faucet-bonus-text">
          Join our email newletter or join us on discord or telegram.
        </td>
      </tr>

    </table>

  </div>
  <style type="text/css">

.faucet-emphasis {
  min-height: 200px;
  min-width: 300px;
  width: 100%;
  border: 4px dashed #efefef;
  border-radius: 5px;
  padding: 6px;
}

.faucet-bonuses {
  width: 100%;
  margin-top: 40px;
}

.faucet-bonus-icon {
  width: 25%;
  max-width:150px;
  max-height: 100px;
}
.faucet-bonus-icon img {
  width: 5em;
}

.faucet-bonus-text {
  width:50%;
  max-width:500px;
}

  </style>
  `;
}
