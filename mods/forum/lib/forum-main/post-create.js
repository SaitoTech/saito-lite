const PostCreateTemplate = require('./post-create.template');


module.exports = PostCreate = {

  render(app, data) {
    let post_create = document.querySelector(".forum-main");
    if (!post_create) { return; }
    post_create.innerHTML = PostCreateTemplate();

    var editor = new MediumEditor('#post-create', {
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

    document.querySelector('.post-submit-btn').addEventListener('click', (e) => {

      let title = document.querySelector('.post-create-title').value;
      let content = document.querySelector('.post-create-textarea').innerHTML;
      let link = document.querySelector('.post-create-link').value;
      let forum = document.querySelector('.post-create-forum').value;

      let newtx = data.forum.createPostTransaction(title, content, link, forum);

      data.forum.app.network.propagateTransaction(newtx);

      newtx.transaction.comments = 0;
      newtx.transaction.votes = 0;

      data.forum.forum.teasers.unshift(newtx);
      data.forum.render(data.forum.app, data);

    });




    console.log("Add Events!");
  },


}
