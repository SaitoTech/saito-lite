module.exports = RegistryAppspaceTemplate = () => {
  return `

      <div class="email-appspace-registry">

	<div class="email-appspace-registry-notice">
        Register an email address:
        </div>

        <div class="email-form">
          <input id="identifier-requested" class="identifier-requested" type="text" placeholder="requested address">
            <button class="registry-submit" id="registry-submit">REGISTER</button>
        </div>



      </div>
      <style type="text/css">
	.email-appspace-registry-notice {
	  padding: 50px;
	  font-size: 3em;
	}
      </style>
  `;
}
