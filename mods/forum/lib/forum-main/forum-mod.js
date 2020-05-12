const ForumModTemplate = require('./forum-mod.template');


module.exports = ForumMod = {

  render(app, data) {

    let forum_main = document.querySelector(".forum-main");
    if (!forum_main) { return; }
    forum_main.innerHTML = ForumModTemplate();


    //
    // all teasers
    // 
    if (data.forum) {
      if (data.forum.forum.mods) {
        if (data.forum.forum.mods.length > 0) {
          for (let i = 0; i < data.forum.forum.mods.length; i++) {

	    let reported_tx = data.forum.forum.mods[i];

	    let html = '';
	        html += `<div class="forum-moderation-post" style="border:1px solid black;padding 5px; margin-bottom:15px;">`;
	        html += `<div style="font-size:1.2em">${reported_tx.transaction.msg.title}</div>`;
	        html += `<div style="font-size:0.9em">${reported_tx.transaction.msg.content}</div>`;
	        html += `<div style="cursor:pointer; display:inline" class="delete" id="${reported_tx.transaction.sig}">delete</div> `;
	        html += `<div style="cursor:pointer; display:inline;" class="approve" id="${reported_tx.transaction.sig}">approve</div>`;
	        html += `</div>`;

	    document.querySelector('.forum-mod-container').innerHTML += html;

          }
        }
      }
    }

  },



  attachEvents(app, data) {

    //add-button for mobile
    document.querySelector('.forum-mobile-new').addEventListener('click', (e) => {
      PostCreate.render(app, data);
      PostCreate.attachEvents(app, data);
    });

    //navigate back to forum
    document.querySelector('.forum-mobile-back').addEventListener('click', (e) => {
      var path = window.location.href.split("/");
      path.pop();
      window.location.href = path.join("/");
    });


    //
    // delete 
    //
    Array.from(document.getElementsByClassName('delete')).forEach(del => {
      del.addEventListener('click', (e) => {

        let newtx = data.forum.createModDeleteTransaction(e.currentTarget.id);
        app.network.propagateTransaction(newtx);

        salert("Post Deleted");

      });
    });

    //
    // approve 
    //
    Array.from(document.getElementsByClassName('approve')).forEach(del => {
      del.addEventListener('click', (e) => {

        let newtx = data.forum.createModApproveTransaction(e.currentTarget.id);
        app.network.propagateTransaction(newtx);

        salert("Post Approved");

      });
    });

  },

}
