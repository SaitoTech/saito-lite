
module.exports = PostViewTemplate = (app, mod) => {
  return `
  <div id="post-view-container" class="post-view-container">

    <div id="post-view-overview" class="post-view-overview">
      <div id="post-view-thumbnail" class="post-view-thumbnail" style="background-image: url('/forum/img/forum-logo.png');"></div>
      <div id="post-view-title" class="post-view-title">Saito selected for Web3 Foundation gaming standard</div>
      <div id="post-view-sublinks" class="post-view-sublinks">
        <div id="post-view-posted-by" class="post-view-posted-by">posted by </div>
        <div id="post-view-user" class="post-view-user">david@saito</div>
        <div id="post-view-report" class="post-view-report">report</div>
      </div>
      <div id="post-view-parent-comment" class="post-view-parent-comment">
His voice stopped abruptly as the music stopped.
There were certain things, and a pwe-dance was one of them, that
pricked him to talk discursively and incautiously; but now he
realized that he had only been talking like a character in a novel,
and not a very good novel.  He looked away.  Elizabeth had listened
to him with a chill of discomfort.  What WAS the man talking about?
was her first thought.  Moreover, she had caught the hated word Art
more than once.  For the first time she remembered that Flory
was a total stranger and that it had been unwise to come out with
him alone.
      </div>
    </div>

    <div id="post-view-comments" class="post-view-comments">
    </div>

    <div id="post-view-leave-comment" class="post-view-leave-comment">
      <div>Leave a comment: </div>
      <div id="comment-create" class="post-view-textarea markdown medium-editor-element" placeholder="Your post..." contenteditable="true" spellcheck="true" data-medium-editor-element="true" role="textbox" aria-multiline="true" data-medium-editor-editor-index="1" medium-editor-index="37877e4c-7415-e298-1409-7dca41eed3b8"></div>
      <button class="post-submit-btn">Submit</button>
    </div>

  </div>
  `;
}

