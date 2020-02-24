const ForumPostTemplate = require('./forum-post.template');

module.exports = ForumPost = {


  render(app, data) {

    let forum_post = document.querySelector(".post-container");
    if (!forum_post) { return; }
    forum_post.innerHTML = ForumPostTemplate(app, data, data.forum.forum.post);

    var editor = new MediumEditor('#post-add-comment-textarea', {
      placeholder: false,
      buttonLabels: 'fontawesome',
      toolbar: {
        allowMultiParagraphSelection: true,
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
        diffLeft: 0,
        diffTop: -10,
        firstButtonClass: 'medium-editor-button-first',
        lastButtonClass: 'medium-editor-button-last',
        relativeContainer: null,
        standardizeSelectionStart: false,
        static: false,
        updateOnEmptySelection: true,
        anchor: {
          customClassOption: null,
          customClassOptionText: 'Button',
          linkValidation: true,
          placeholderText: 'Paste or type a link',
          targetCheckbox: true,
          targetCheckboxText: 'Open in new window'
        }
      }
    });
  },



  attachEvents(app, data) {

    console.log("Add Events!");

    document.querySelector('.post-add-comment-btn').addEventListener('click', (e) => {

      let parent_id = document.querySelector('.post-parent-id').value;
      let post_id = document.querySelector('.post-post-id').value;
      let content = document.querySelector('.post-add-comment-textarea').innerHTML;
      let forum = document.querySelector('.post-forum').value;
      let newtx = data.forum.createPostTransaction("", content, "", forum, post_id, "", parent_id);

      app.network.propagateTransaction(newtx);

      newtx.transaction.comments = 0;
      newtx.transaction.votes = 0;

      data.forum.forum.comments.unshift(newtx);
      data.forum.render(app, data);


    });



  },

}
