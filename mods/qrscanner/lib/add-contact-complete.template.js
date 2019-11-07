module.exports = AddContactCompleteTemplate = () => {
  // height: calc(100vh-5em);
  return `
    <div class="header"></div>
    <div
      style="
        display: grid;
        grid-gap: 1em;
        justify-items: center;
        align-items: center;
        padding: 1em;
        margin-top: 5em;
      ">
      <div style="display:grid; grid-template-columns: 5.2em auto 5.2e; width:100%">
        <i id="back-button" class="icon-med fas fa-arrow-left"></i>
        <h3 style="justify-self: center">Your request has been sent</h3>
      </div>
      <button style="margin: 0; width: 100%;padding: 1em;font-size: 1.2em;" onclick="location.href='/email'"><i class="far fa-envelope"></i>Email</button>
      <button style="margin: 0; width: 100%;padding: 1em;font-size: 1.2em;" onclick="location.href='/chat'"><i class="far fa-comments"></i>Chat</button>
    </div>
  `;
};