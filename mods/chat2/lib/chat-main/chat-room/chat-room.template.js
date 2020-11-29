module.exports = ChatRoomTemplate = (room_id) => {
    return `
        <div class="chat-room" id="chat-room-${room_id}">
            <div class="chat-room-header"></div>
            <div class="chat-room-content" id="chat-room-content-${room_id}"></div>
            <div class="chat-room-footer"></div>
        </div>
    `;
}