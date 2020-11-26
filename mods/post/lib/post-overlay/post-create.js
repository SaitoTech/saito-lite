const PostCreateTemplate = require('./post-create.template');
const SaitoOverlay = require('./../../../../lib/saito/ui/saito-overlay/saito-overlay');


module.exports = PostCreate = {

  render(app, mod) {

    this.new_post = {};
    this.new_post.images = [];
    this.new_post.title = "";
    this.new_post.comment = "";
    this.new_post.link = "";
    this.new_post.forum = "";

    mod.overlay = new SaitoOverlay(app, mod);
    mod.overlay.render(app, mod);
    mod.overlay.attachEvents(app, mod);

    mod.overlay.showOverlay(app, mod, PostCreateTemplate(), function() {
    });

    this.showTab("discussion");

    document.querySelector('.post-create-header-discussion').onclick = (e) => { this.showTab("discussion"); }
    document.querySelector('.post-create-header-link').onclick = (e) =>       { this.showTab("link"); }
    document.querySelector('.post-create-header-image').onclick = (e) =>      { this.showTab("image"); }

    app.browser.addDragAndDropFileUploadToElement("post-create-image", (file) => {
      console.log(file);
      this.new_post.images.push(file);
    });

  },

  attachEvents(app, mod) {

    document.querySelector('.post-submit-btn').onclick = (e) => {

      this.new_post.title = document.querySelector('.post-create-title').value;
      this.new_post.comment = document.querySelector('.post-create-textarea').innerHTML;
      this.new_post.link = document.querySelector('.post-create-link-input').value;
      this.new_post.forum = document.querySelector('.post-create-forum').value;

      let newtx = mod.createPostTransaction(this.new_post.title, this.new_post.comment, this.new_post.link, this.new_post.forum, this.new_post.images);
      app.network.propagateTransaction(newtx);

      newtx.children = 0;
      mod.posts.push(newtx);
      mod.render();

      mod.overlay.hideOverlay();

    }

  },





  showTab(tab) {

    let classname = ".post-create-header-"+tab;

    document.querySelectorAll('.post-create-header-item').forEach(el => { el.classList.remove("post-create-active"); }); 
    document.querySelector(classname).classList.toggle("post-create-active");

    if (tab === "discussion") {
      document.querySelector(".post-create-link").style.display = "none";
      document.querySelector(".post-create-image").style.display = "none";
      document.querySelector(".post-create-textarea").style.display = "block";
    }

    if (tab === "link") {
      document.querySelector(".post-create-link").style.display = "block";
      document.querySelector(".post-create-image").style.display = "none";
      document.querySelector(".post-create-textarea").style.display = "none";
    }

    if (tab === "image") {
      document.querySelector(".post-create-link").style.display = "none";
      document.querySelector(".post-create-image").style.display = "block";
      document.querySelector(".post-create-textarea").style.display = "none";
    }

  }

}

