module.exports =  RequestPhotoTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="order-template">
    
  <h2>DHB Order Tracking</h2>

  <div class="order-head request-photo">
    <div class="main-form">
    <div class="button request-photo-photo">
      <i class="fas fa-camera"></i>  Take Photo
    </div>
    <div class="button request-photo-note">
      <i class="fa fa-edit"></i>  Add Note
    </div>
    </div>
  </div>

 
</div>


  `;

  return html;

}