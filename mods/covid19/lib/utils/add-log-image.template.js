module.exports = AddLogImageTemplate = (app, data) => {

    let html = '';
  
    html = `
    <div class="log-template modal-form-wrapper">
      
    <h2>Add Log Message</h2>
    <div class="modal-form grid-2"></div>
    <div class="modal-form-buttons">
      <button id='cancel-log' class='cancel-log'>  Cancel</button>
      <button id='add-log' class='add-log'><i class="fas fa-chevron-circle-right"></i>  Add Image</button>
    </div>
  </div>
  
  
    `;
  
    return html;
  
  }