module.exports = ChatBoxTemplate = (group) => {
  return `
      <div id="chat-box-${group.id}" class="chat-box">
	<div id="chat-box-header-${group.id}" class="chat-box-header"></div>
	<div id="chat-box-main-${group.id}" class="chat-box-main"></div>
	<div id="chat-box-input-${group.id}" class="chat-box-input"></div>
      </div>
  `;
}
