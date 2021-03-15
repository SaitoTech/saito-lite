module.exports = AlertKeyAppspaceTemplate = (app) => {

  let html = `
  <div class="email-appspace-settings">

    <h2>Network Migration Alert</h2>

    <p></p>

    Provide the alert privatekey to send a message preparing the network for update:

    <p></p>

    <input type="text" class="alert-input" id="alert-input" />

    <p></p>

    <div class="button">send alert</div>
  </div>

  `;

  return html;

}

