module.exports = SupplierProfileTemplate = () => {

  let html = '';

  html = `
  <div class="supplier-information">

    <h2>Supplier Profile:</h2>

    <p></p>

    <div class="loading">

      Please wait while we confirm your identity....

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
