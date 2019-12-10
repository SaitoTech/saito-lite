module.exports = FaucetAppspaceTemplate = (app) => {
  return `
  <link rel="stylesheet" href="/faucet/style.css">
  <div class="email-appspace-faucet">

    <div class="faucet_emphasis">

      <h3>Register Username:</h3>

      <p></p>

      You should register a Saito username:

    </div>

    <div class="faucet_emphasis">

      <h3>Backup Your Wallet:</h3>

      <p></p>

      This will encrypt a copy of your wallet, and email it to your email address:

      <p></p>

      <input type="text" value="email@domain.com" />

      <p></p>

      <button class="" >backup wallet</button>

    </div>


    <table class="faucet_bonuses">

      <tr>
	<td class="faucet_bonus_icon">
          <img src="/saito/img/logo-color.svg" />
        </td>
        <td class="faucet_bonus_text">
	  Not a robot? It's not that we don't like robots, but we can't afford to keep paying them money and still have tokens for numans that want. That's why we're on the blacklist. But it also means you can fill out a captcha and get a bunch of tokens right away.
        </td>
      </tr>

      <tr>
	<td class="faucet_bonus_icon">
          <img src="/saito/img/logo-color.svg" />
        </td>
        <td class="faucet_bonus_text">
	  Backup your wallet and we'll send you a heap of Saito tokens, enough to use the network for a long, long, time. Backing up your wallet is important as it provides you with the ability to restore your account.
        </td>
      </tr>

      <tr>
	<td class="faucet_bonus_icon">
          <img src="/saito/img/logo-color.svg" />
        </td>
        <td class="faucet_bonus_text">
	  Install a new module. Saito supports installing new applications. Visit our appstore and install a new application and we will send you a large number of tokens.
        </td>
      </tr>

      <tr>
	<td class="faucet_bonus_icon">
          <img src="/saito/img/logo-color.svg" />
        </td>
        <td class="faucet_bonus_text">
	  Share your experience with Saito on Twitter or Facebook. Whether positive or negative, we love all feedback. That's enough to keep using the network for a long time.
        </td>
      </tr>

      <tr>
	<td class="faucet_bonus_icon">
          <img src="/saito/img/logo-color.svg" />
        </td>
        <td class="faucet_bonus_text">
	  Join our email newletter or join us on discord or telegram.
        </td>
      </tr>

    </table>

  </div>
  <style type="text/css">

.faucet_emphasis {
  min-height: 200px;
  min-width: 300px;
  width: 45%;
  float:left;
  border: 4px dashed #efefef;
  border-radius: 5px;
  padding: 6px;
  margin-right: 20px;
}

.faucet_bonuses {
  width: 100%;
  margin-top: 40px;
}
.faucet_bonus_icon {
  width: 25%;
  max-width:150px;
  max-height: 100px;
}
.faucet_bonus_text {
  width:50%;
  max-width:500px;
}

  </style>
  `;
}
