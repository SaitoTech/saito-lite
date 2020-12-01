
module.exports = ChatRoomTemplate = (group_id) => {
    return `
        <div class="chat-room" id="chat-room-${group_id}">
            <div class="chat-room-header"></div>
            <div class="chat-room-content" id="chat-room-content-${group_id}"></div>
            <div class="chat-room-footer"></div>
        </div>
    `;
}


