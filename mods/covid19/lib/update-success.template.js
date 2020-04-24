module.exports = UpdateSuccessTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="update-success">
   
  <center>
    <h1>Transaction Sent</h1>
    <div class="loader" id="game_spinner"></div>
  </center>
    

    
  </div>


  `;

  return html;

}
