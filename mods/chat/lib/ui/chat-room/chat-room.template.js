module.exports = ChatRoomTemplate = (room_id) => {
    return `
        <div id="${room_id}" class="chat-room">
            <div id="${room_id}" class="chat-room-content">
            </div>
        </div>
    `;
}