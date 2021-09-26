const NewPostTemplate = require('./new-post.template');
const elParser = require('../../../../lib/helpers/el_parser');

module.exports = NewPost = {

    render(app, data) {
        document.body.append(elParser(NewPostTemplate(app, data)));
    },

    attachEvents(app, data) {
        document.querySelector('.new-post-btn').addEventListener('click', (e) => {
            var post_content = document.querySelector('.new-post-content').value;
            newtx = data.post.createPostTransaction(post_content);
            app.network.propagateTransaction(newtx);
        });

        document.querySelector('.post-close').addEventListener('click', (e) => {
            if (document.querySelector('.new-post-wrapper')) {
                document.querySelector('.new-post-wrapper').destroy();
            }
        });
    }

}
