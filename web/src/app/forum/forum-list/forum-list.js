import { ForumAdd } from '../forum-add/forum-add.js';
import { ForumListTemplate } from './forum-list.template.js';
import { ForumListPostTemplate } from './forum-list-post.template.js';

import { ForumDetail } from '../forum-detail/forum-detail.js';

export const ForumList = {
  render(mod) {
    document.querySelector('.main').innerHTML = ForumListTemplate();
    mod.forum.posts.forEach((post, index) => {
      document.querySelector('.forum-table').innerHTML += ForumListPostTemplate(post, index);
    });

    this.attachEvents(mod);
  },

  attachEvents(mod) {
    document.querySelector('#forum.create-button')
            .addEventListener('click', (e) => {
                ForumAdd.render(mod);
            });

    Array.from(document.getElementsByClassName('forum-row'))
         .forEach(row => {
            let post = mod.forum.posts[row.id];
            let body = row.children[1]
            let votes = row.children[2];

            votes.children[0].addEventListener('click', (e) => {
              mod.app.saito.network.sendRequest('forum vote', {vote: 1, type: 'post', id: post.post_id});
              votes.children[1].innerHTML = parseInt(votes.children[1].innerHTML) + 1;
              post.votes += 1;
            });

            votes.children[2].addEventListener('click', (e) => {
              mod.app.saito.network.sendRequest('forum vote', {vote: -1, type: 'post', id: post.post_id});
              votes.children[1].innerHTML = parseInt(votes.children[1].innerHTML) - 1;
              post.votes -= 1;
            });

            body.addEventListener('click', (e) => {
                let post_index = parseInt(e.currentTarget.id);
                post = mod.forum.posts[row.id];
                let comments = mod.forum.comments[post.post_id] || [];
                ForumDetail.render(mod, post, comments);
            });
          }
        );
  }
}