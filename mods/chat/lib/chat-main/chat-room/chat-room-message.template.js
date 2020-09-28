module.exports = ChatRoomMessageTemplate = ({ message, sig, type }, data) => {

  // Preview common path/to/file.ext URL images
  var imgs = [".apng",".gif",".ico",".cur",".jpg",".jpeg",".jfif",".pjpeg",".pjp",".png",".svg"];
  try {
    var link = message.match(/<a href="([^"]*)/)[1];
    for (var img of imgs){
      if (link.includes(img)){
        return `
        <div id="${sig}" class="chat-room-message chat-room-message-${type}">
          <div class="chat-message-text">${message}</div>
        </div>
        <div id="${sig}" class="chat-room-message chat-room-message-${type}">
          <div class="chat-message-text">
              <img class="img-preview" src="${link}">
          </div>
        </div>`;
      }
    }
    
  } catch (err) { }
  //

  return `
    <div id="${sig}" class="chat-room-message chat-room-message-${type}">
      <div class="chat-message-text">${message}</div>
    </div>
  `
}