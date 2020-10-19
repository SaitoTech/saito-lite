var ModTemplate = require('../../lib/templates/modtemplate');

class TutorialTest01 extends ModTemplate {

  constructor(app) {

    super(app);

    this.name            = "TutorialTest01";
    this.description     = "Email module with a clickable button - creating simple transactions";
    this.categories      = "Tutorials";

    return this;

  }
  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {};
      obj.render = this.renderEmailPlugin;
      obj.attachEvents = this.attachEventsEmailPlugin;
      return obj;
    }
    return null;
  }
 
  renderEmailPlugin(app, data) {
    try {
      document.querySelector('.email-appspace').innerHTML = `When the email application asks us to draw the screen, we give it this button:<p></p><input type="button" id="tutorial01-email-btn" class="tutorial01-email-btn" value="Click me!" />`;
    } catch (err) {
      console.log("Error rendering tutorial01 email plugin: " + err);
    }
  } 
  // 
  // attachEventsEmailPlugin(app, data) {
  //   try {
  //     document.querySelector('.tutorial01-email-btn').addEventListener('click', function(e) {
  //       alert("You have clicked on this button!"); 
  //     });
  //   } catch (err) {
  //     console.log("Error rendering tutorial01 email plugin: " + err);
  //   }
  // }
  
  attachEventsEmailPlugin(app, data) {
    try {  
      document.querySelector('.tutorial01-email-btn').addEventListener('click', function(e) {
      
        let newtx = app.wallet.createUnsignedTransactionWithDefaultFee();
            newtx.transaction.msg.module  = "Email";
            newtx.transaction.msg.title   = "Tutorial button clicked!";
            newtx.transaction.msg.message = "When you clicked this button, your computer created and sent a transaction onto the blockchain. If you have received this transaction, it is already on the blockchain.";
        newtx = app.wallet.signTransaction(newtx);
        app.network.propagateTransaction(newtx);
         
        alert("Transaction Sent!");
        document.querySelector('.email-appspace').innerHTML = 'You have sent yourself a transaction. Check your inbox!';
       
      });
    } catch (err) {
      console.log("Error rendering tutorial01 email plugin: " + err);
    }
  } 
}

module.exports = TutorialTest01;

