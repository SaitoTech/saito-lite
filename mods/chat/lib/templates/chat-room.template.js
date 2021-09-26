
module.exports = ChatRoomTemplate = (group) => {
    return `
        <div class="chat-room" id="chat-room-${group.id}">

            <div class="chat-room-header">
	      <i id="back-button" class="icon-med fas fa-arrow-left"></i>
	      <p class="chat-room-name">${group.name}</p>
	    </div>

            <div class="chat-room-content" id="chat-room-content-${group.id}" style="max-height:100%;overflow-y: scroll;"></div>

            <div class="chat-room-footer">
              <div class="chat-room-input">
                <textarea data-id="${group.id}" id="input" class="chat-room-input"></textarea>
                <div class="chat-room-submit-button"><i class="icon-small fas fa-arrow-right"></i></div>
              </div>
	    </div>

        </div>
    `;
}


