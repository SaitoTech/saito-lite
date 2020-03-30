module.exports = UpdateSuccessTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="update-success">

    You have sent a transaction onto the network to update your company or product information.

    <p></p>

    It usually takes around a minute for records to be verified and updated.

    <p></p>

    Please wait a minute and then <a href="/covid19">click here</a> to continue.

  </div>


  `;

  return html;

}
