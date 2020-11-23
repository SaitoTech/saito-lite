
module.exports = PostViewCommentTemplate = (app, mod) => {
  return `
  <div id="post-view-comment" class="post-view-comment">
    <div id="post-view-comment-sublinks" class="post-view-comment-sublinks">
      <div id="post-view-posted-by" class="post-view-posted-by">comment by </div>
      <div id="post-view-user" class="post-view-user">david@saito</div>
      <div id="post-view-report" class="post-view-report">report</div>
    </div>
    <div id="post-view-comment-text" class="post-view-comment-text">
Yet with Elizabeth serious talk seemed
impossible.  It was
as though there had been a spell upon them that made all their
conversation lapse into banality; gramophone records, dogs, tennis
racquets--all that desolating Club-chatter. She seemed not to WANT
to talk of anything but that. He had only to touch upon a subject
of any conceivable interest to hear the evasion, the 'I shan't
play', coming into her voice.
    </div>
  </div>
  `;
}

