export const ChatRoomMessageTemplate = (sig, msg, author, ts, type) => {
  let datetime = new Date(ts);
  return `
    <div id="${sig***REMOVED***" class="chat-room-message chat-room-message-${type***REMOVED***">
      <p>${msg***REMOVED***</p>
      <div class="chat-message-header">
          <p class="chat-message-author">${author.substring(0, 20)***REMOVED***</p>
          <p class="chat-message-timestamp">${datetime.getHours()***REMOVED***:${datetime.getMinutes()***REMOVED***</p>
      </div>
    </div>
  `
***REMOVED***