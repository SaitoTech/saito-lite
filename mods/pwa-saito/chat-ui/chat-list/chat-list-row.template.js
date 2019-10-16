export const ChatListRowTemplate = ({name, room_id***REMOVED***, {message, timestamp***REMOVED***) => {
  let datetime = new Date(timestamp);
  return `
    <div id="${room_id***REMOVED***" class="chat-row">
      <img src="logo-color.svg">
      <div class="chat-content">
          <div class="chat-group-name">${name***REMOVED***</div>
          <div class="chat-last-message">${message.substring(0, 72)***REMOVED***</div>
      </div>
      <div class="chat-last-message-timestamp">${datetime.getHours()***REMOVED***:${datetime.getMinutes()***REMOVED***</div>
    </div>
  `;
***REMOVED***