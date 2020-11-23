const PostCreateTemplate = require('./post-create.template');
const SaitoOverlay = require('./../../../../lib/saito/ui/saito-overlay/saito-overlay');

module.exports = PostCreate = {

  render(app, mod) {

    mod.overlay = new SaitoOverlay(app, mod);
    mod.overlay.render(app, mod);
    mod.overlay.attachEvents(app, mod);

    mod.overlay.showOverlay(app, mod, PostCreateTemplate(), function() {
    });

    this.showTab("discussion");

    document.querySelector('.post-create-header-discussion').onclick = (e) => { this.showTab("discussion"); }
    document.querySelector('.post-create-header-link').onclick = (e) =>       { this.showTab("link"); }
    document.querySelector('.post-create-header-image').onclick = (e) =>      { this.showTab("image"); }

  },


  attachEvents(app, mod) {

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

