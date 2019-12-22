module.exports = FaucetModalBackupPasswordTemplate = () => { 
 
  return `
          <div style="margin-top:20px;">

	    <b>password:</b>
            </br>
	    <input type="text" id="password1" style="background-color:white;margin-right:10px;width:200px;height:30px;" />

	    <p></p>

	    <b>confirm:</b>
            </br>
	    <input type="text" id="password2" style="background-color:white;margin-right:10px;width:200px;height:30px;" />

	    <p></p>

	    <button class="submit-encrypt-wallet-btn">Encrypt and Send</button>

         </div>

  `;
}
