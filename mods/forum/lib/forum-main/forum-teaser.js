const ForumTeaserTemplate = require('./forum-teaser.template');

module.exports = ForumTeaser = {

  render(app, data) {

    let teasers = document.querySelector(".teasers");
    if (!teasers) { return; }
    teasers.innerHTML += ForumTeaserTemplate(app, data.forum.forum.teaser);

  },


  attachEvents(app, data) {
    console.log("Add Events to Teaser!");

    //
    // upvotes
    //
    Array.from(document.getElementsByClassName('post_upvote')).forEach(upvote => {
      upvote.addEventListener('click', (e) => {
	e.currentTarget.style.color = "#ff8235";
        let newtx = data.forum.createVoteTransaction(e.currentTarget.id, "upvote");
	app.network.propagateTransaction(newtx);
      });
    });

    //
    // downvotes
    //
    Array.from(document.getElementsByClassName('post_downvote')).forEach(downvote => {
      downvote.addEventListener('click', (e) => {
	e.currentTarget.style.color = "#ff8235";
        let newtx = data.forum.createVoteTransaction(e.currentTarget.id, "downvote");
	app.network.propagateTransaction(newtx);
      });
    });

  },

}
