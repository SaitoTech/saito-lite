module.exports = FaucetModalBackupPasswordTemplate = () => { 
 
  return `
          <div style="margin: 1em 0;display:grid;grid-gap:1em;min-width:250px;width:33%;">

		  <div>
            <label>Password</label>
			<input type="text" id="password1" style="font-family:p-word;" />
		  </div>
		  <div>
		    <label>Confirm</label>
            <input type="text" id="password2" style="font-family:p-word;" />
          </div>

          <button class="submit-encrypt-wallet-btn">Encrypt and Send</button>

          </div>

  `;
}
