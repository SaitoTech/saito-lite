const ArcadeInviteTemplate = require('./arcade-invite.template');
module.exports = ArcadeMainTemplate = (app, mod, invites) => {
  let invitesHtml = "";
  invites.forEach((invite, i) => {
    invitesHtml += ArcadeInviteTemplate(app, mod, invite)
  });
  
  return `
    <div id="arcade-main" class="arcade-main">
      <div id="arcade-hero" class="arcade-hero">
        ${invitesHtml}
      </div>
      <div id="arcade-sub" class="arcade-sub">
      </div>
    </div>
  `;
}
