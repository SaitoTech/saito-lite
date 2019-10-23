module.exports = ChatListRowTemplate = ({name, group_id***REMOVED***, {message, timestamp***REMOVED***) => {
  let datetime = new Date(timestamp);
  let minutes = datetime.getMinutes();
  minutes = minutes.toString().length == 1 ? `0${minutes***REMOVED***` : `${minutes***REMOVED***`;
  return `
    <div id="${group_id***REMOVED***" class="chat-row">
      <img src="/saito/img/logo-color.svg">
      <div class="chat-content">
          <div class="chat-group-name">${name***REMOVED***</div>
          <div class="chat-last-message">${message.substring(0, 72)***REMOVED***</div>
      </div>
      <div class="chat-last-message-timestamp">${datetime.getHours()***REMOVED***:${minutes***REMOVED***</div>
    </div>
  `;
***REMOVED***