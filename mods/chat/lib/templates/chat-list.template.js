module.exports = ChatListTemplate = () => {

  let html = `
      <div id="chat-list-container" class="chat-list-container">
      </div>
      <button id="chat" class="create-button"><i class="fas fa-plus"></i></button>
      <div id="chat-nav" class="chat-dropdown" style="display: none"><ul style="display: grid;grid-gap: 0.5em;" id="chat-navbar" class="chat-navbar"><li id="chat-nav-add-contact" class="chat-nav-row"><i class="fas fa-user-plus"></i>Add Contact</li></ul>
        <div class="chat-nav-arrow"></div>
        <div class="chat-nav-arrow" id="chat-nav-arrow-interior"></div>
      </div>
  `;

  return html;

}

