module.exports = SupplierProfileTemplate = () => {

  let html = '';

  html = `
  <div class="supplier-information">

    <h2>Welcome Supplier!</h2>

    <p></p>

    <div class="loading">

      Please be patient while we load your account. 

      <p></p>

      Your browser is performing a series of cryptographic checks with our server to confirm your identity.

      <p></p>

      This process normally takes about 10 seconds. 

    </div>

    <div class="profile" style="display:none">

     <div class="profile-information"></div> 
    
     <div class="flex-around">
       <div class="edit-supplier-btn button" style="display:none" >Edit Information</div>
       <div class="confirm-supplier-btn button" style="display:none" >Add / View Products</div>
       <div class="new-supplier-btn button" style="display:none" >Create Account</div>
     </div>
    </div>
  </div>
  `;

  return html;

}
