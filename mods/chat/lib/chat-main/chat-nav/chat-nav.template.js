module.exports = ChatNavTemplate = () => {
  return `
    <div id="chat-nav" class="header-dropdown" style="display: none">
      <ul style="display: grid;grid-gap: 0.5em;">
        <li class="chat-nav-row"><i class="far fa-comment"></i>New Chat</li></a>
        <li class="chat-nav-row"><i class="fas fa-user-plus"></i>Add Contact</li></a>
      </ul>
      <div class="chat-nav-arrow"></div>
      <div class="chat-nav-arrow" id="chat-nav-arrow-interior"></div>
    </div>
  `;
***REMOVED***