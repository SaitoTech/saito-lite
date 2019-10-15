module.exports = ChatRoomMessageTemplate = ({ message, publickey, timestamp ***REMOVED***, sig, type) => {
  let datetime = new Date(timestamp);
  return `
    <div id="${sig***REMOVED***" class="chat-room-message chat-room-message-${type***REMOVED***">
      <p>${message***REMOVED***</p>
      <div class="chat-message-header">
          <p class="chat-message-author">${publickey.substring(0, 20)***REMOVED***</p>
          <p class="chat-message-timestamp">${datetime.getHours()***REMOVED***:${datetime.getMinutes()***REMOVED***</p>
      </div>
    </div>
  `
***REMOVED***