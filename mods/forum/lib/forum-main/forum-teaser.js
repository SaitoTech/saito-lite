const ForumTeaserTemplate = require('./forum-teaser.template');

module.exports = ForumTeaser = {

  render(app, data) {

    let teasers = document.querySelector(".teasers");
    if (!teasers) { return; }
    teasers.innerHTML += ForumTeaserTemplate(app, data.forum.forum.teaser);

  },


  attachEvents(app, data) {
    console.log("Add Events to Teaser!");
  },

}
