module.exports = EmailContainerTemplate = () => {
  return `
    <div class="email-container">
      <div id="email-sidebar" class="email-sidebar">
        <div class="email-module-title"><h2>Saito Mail</h2></div>
        <ul id="email-mod-buttons">
          <li class="button">Inbox</li>
          <li class="button">Sent</li>
          <li class="button">Pandora</li>
        </ul>
      </div>
      <div class="email-content">
        <div class="email-header">
          <div class="email-icons">
            <i class="icon-med far fa-square"></i>
            <i class="icon-med fas fa-trash-alt"></i>
          </div>
          <div class="email-balance">1200.0000000 Saito</div>
        </div>
        <div class="email-body">
        </div>
      </div>
      <button id="email" class="create-button"><i class="fas fa-plus"></i></button>
    </div>
  `
}