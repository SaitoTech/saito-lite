export const ChatRoomHeaderTemplate = (room_name) => {
    return `
        <i id="back-button" class="icon-med fas fa-arrow-left"></i>
        <p class="chat-room-name">${room_name}</p>
        <i id="notifications" class="header-icon icon-med far fa-envelope"></i>
        <i id="settings" class="header-icon icon-med fas fa-cog"></i>
    `;
}
