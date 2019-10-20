module.exports = EmailContainerTemplate = () => {
  //<i id="email-select-icon" class="icon-med far fa-square"></i>
  return `
    <div class="email-container">
      <div id="email-sidebar-container" class="email-sidebar-container">
      </div>
      <div class="email-content">
        <div class="email-header">
        </div>
        <div class="email-body">
        </div>
      </div>
      <button id="email" class="create-button"><i class="fas fa-plus"></i></button>
    </div>
  `
}
