module.exports = EmailContainerTemplate = () => {
  //<i id="email-select-icon" class="icon-med far fa-square"></i>
  return `
    <div class="email-container">
      <div id="email-sidebar-container" class="email-sidebar-container">

      </div>
      <div class="email-content">
        <div class="email-header">
          <div class="email-icons">
            <input id="email-select-icon" type="checkbox">
            <i id="email-delete-icon" class="icon-med fas fa-trash-alt"></i>
          </div>
          <div class="email-balance">${("0.0000000").replace(/0+$/,'').replace(/\.$/,'\.0')***REMOVED*** Saito</div>
        </div>
        <div class="email-body">
        </div>
      </div>
      <button id="email" class="create-button"><i class="fas fa-plus"></i></button>
    </div>
  `
***REMOVED***
