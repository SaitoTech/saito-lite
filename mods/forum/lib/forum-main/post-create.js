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
      
      let format = this.validateInput(title, content, link, forum);
      console.log(format);
      if (format){
        // let newtx = data.forum.createPostTransaction(title, content, link, forum);

        // data.forum.app.network.propagateTransaction(newtx);

        // newtx.transaction.comments = 0;
        // newtx.transaction.votes = 0;

        // data.forum.forum.teasers.unshift(newtx);
        // data.forum.render(data.forum.app, data);
      }
    });




    console.log("Add Events!");
  },
  validateInput(title, content, link, forum) {
    try {
      let msg = "";
      if (title != "") {
        /* TODO: Title format + sanitation */

        title = this.formatHtml(title);

        console.log("title: [" + title + "]");
      } else {
        msg += "Title can't be empty. ";
      }
      if (link != "") {
        /* TODO link format + sanitation */

        link = this.formatUrl(link);
        if (!this.isValidLink(link)) { msg += "Not a valid link. (don't forget http:// or https://) "; }

        console.log('link: [' + link + ']');
      }
      if (content != "") {
        /* Already formated by MediumEditor */

        console.log("content: [" + content + "]");
      }
      if (forum != "") {
        /* TODO forum format + sanitation */

        forum = this.formatHtml(forum);
        if (!this.isValidForum(forum)) { msg += "Not a valid forum "; }

        console.log("forum: [" + forum + "]");
      }
      if (msg !== "") { 
        salert(msg);
        return false;
      }
      return {
        title: title,
        content: content,
        link: link,
        forum: forum
      };
    } catch (err) {
      console.log("[ERROR] validateInput: " + err);
    }
    return false;
  },
  formatFrontSpace(str){
    let newstr = str.match(/[^ ].*/)[0];
    return newstr;
  },
  formatHtml(html) {
    let str = this.formatFrontSpace(html);
    str = str.replace(/[<>&'"]/gi, function(e) {
      // if (e === "<") { return "&lt"; } else { return "&gt"; }
      switch (e) {
        case "<":
          return "&lt;";
          break;
        case ">":
          return "&gt;";
          break;
        case "&":
          return "&amp;";
          break;
        case "'":
          return "&apos;";
          break;
        case '"':
          return "&quot;";
          break;
      }
      return e;
    });
    return str;
  },
  formatUrl(url){
    let regexp =  /^(https?:\/\/)?/; /* Check for http:// or https:// */
    if (!regexp.test(url)){
      let new_url = `https://` + url;
      return new_url;
    }
    return url;
  },
  isValidLink(str) {
    try {
      let url = new URL(str);
      return true;
    } catch (err) {
      console.log('[ERROR] isValidLink: ' + err);
    }
    return false;
    // let regexp =  `^(https?:\/\/)?`; /*check for http:// or https:// */
    // let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i;
    // return regexp.test(str);
  },
  isValidForum(str){
    let regexp = /[^a-z0-9/_-]/i;
    return !regexp.test(str);
  },


}
