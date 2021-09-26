const ShowPostTemplate = require('./show-post.template');
const elParser = require('../../../../lib/helpers/el_parser');

module.exports = ShowPost = {

    render(app, data, row) {
        let row_object = JSON.parse(row); 
        document.body.append(elParser(ShowPostTemplate(app, data, row_object)));
    },

    attachEvents(app, data, row) {
        let row_object = JSON.parse(row);
        if (document.querySelector('.show-post-update-btn')) {
            document.querySelector('.show-post-update-btn').addEventListener('click', (e) => {
                showtx = data.post.createPostTransaction(row_object.content, "update");
                app.network.propagateTransaction(showtx);
            });
        }
    }

}
