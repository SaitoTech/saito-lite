module.exports = EmailNavigatorTemplate = () => {
  return `
      <ul class="email-navigator" id="email-navigator"> 
	<li id="email-navigator-item" id="inbox">inbox</li>
	<li id="email-navigator-item" id="sent">sent</li>
	<li id="email-navigator-item" id="trash">trash</li>
	<li id="email-navigator-item" id="apps">apps</li>
     </ul>
  `;
}
