module.exports = LogTemplate = () => {

    let html = `

      <div class="log-frame">
        <div class="log-messages"></div>
        <div class="new-log-message">
          <div class="log-message-input"></div>
          <div class="log-message-add">
            <i class="far fa-compass hidden"></i>
            <i class="fas fa-camera hidden"></i>
            <i class="fas fa-image"></i>
            <i class="fas fa-align-left"></i>
          </div>
        </div>
      </div>

    `;
    return html;
  
  }