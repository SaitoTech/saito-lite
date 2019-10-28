module.exports = EmailAppspaceTemplate = () => {
  return `

      <div class="email-appspace-encrypt">

	<div class="email-appspace-encrypt-notice">
        Create a secure key to encrypt your emails / chats:
        </div>

        <div class="email-form">
          <input id="email-to-address" class="email-address" type="text" placeholder="To: ">
            <button class="email-submit">SUBMIT</button>
            <button class="fetch">FETCH</button>
        </div>



      </div>
      <style type="text/css">
	.email-appspace-encrypt-notice {
	  padding: 50px;
	  font-size: 3em;
	}
      </style>
  `;
}
