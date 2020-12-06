module.exports = ChatBoxTemplate = (group) => {
  return `
      <div data-id="${group.id}" id="chat-box-${group.id}" class="chat-box">
	<div id="chat-box-header-${group.id}" class="chat-box-header">
          <span><h2 class="chat-box-header-title">${group.name}</h2></span>
          <span class="chat-box-close" id="chat-box-close-${group.id}" style="justify-self:end;font-size: 0.75em">&#x2715</span>
	</div>
	<div id="chat-box-main-${group.id}" class="chat-box-main"></div>
	<div id="chat-box-input-${group.id}" class="chat-box-input">
          <textarea class="chat-box-new-message-input" id="chat-box-new-message-input-${group.id}"></textarea>
          <div class="chat-room-submit-button" id="chat-room-submit-button-${group.id}"><i class="icon-small fas fa-arrow-circle-right"></i></div>
        </div>
      </div>
  `;
}
