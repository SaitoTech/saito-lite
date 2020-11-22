
module.exports = PostTeaserTemplate = (app, mod) => {
  return `
    <div data-id="" id="post-teaser" class="post-teaser">
        <div id="post-teaser-thumbnail" class="post-teaser-thumbnail" style="background-image: url('/forum/img/forum-logo.png');"></div>
        <div id="post-teaser-title"     class="post-teaser-title">Saito selected for Web3 Foundation gaming standard</div>
        <div id="post-teaser-sublinks"  class="post-teaser-sublinks">
	  <div id="post-teaser-posted-by" class="post-teaser-posted-by">posted by </div>
	  <div id="post-teaser-user" class="post-teaser-user">david@saito</div>
	  <div id="post-teaser-comments" class="post-teaser-comments">2 comments</div>
	  <div id="post-teaser-report" class="post-teaser-report">report</div>
        </div>
    </div>

  `;
}

