module.exports = ChatRoomMessageBubbleTemplate = ({ message, sig, type, identicon_color }, data) => {
  let style_html = type === "myself" ? '' : `style="background: ${identicon_color}"`;
  // if (document.getElementById(sig)) { return ""; } 
  return `
    <div id="${sig}" class="chat-room-message chat-room-message-${type}" ${style_html}>
      <div class="chat-message-text">${message}</div>
    </div>
  `
}
