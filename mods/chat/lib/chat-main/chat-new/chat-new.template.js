module.exports = ChatNewTemplate = () => {
  return `
    <div class="chat-new">
      <div class="chat-new-header">
        <i id="back-button" class="icon-med fas fa-arrow-left"></i>
          <div style="
            display: flex;
            align-items: center;
            padding: 5px;
            height: 100%;
            ">
          <input id="chat-new-search" type="text" placeholder="Search" style="
            border-bottom: unset;
            padding: unset;
            margin: 7px;
            ">
          <i class="fa fa-search"></i>
          </div>
        </div>
      <div class="chat-new-content">
      </div>
    </div>
  `;
***REMOVED***