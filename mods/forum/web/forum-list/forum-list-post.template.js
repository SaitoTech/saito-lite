export const ForumListPostTemplate = ({title, author, subreddit, comments, votes}, index) => {
  return `
    <div id="${index}" class="forum-row">
      <div class="forum-image">
          <img src="logo-color.svg">
      </div>
      <div class="forum-content">
          <div class="forum-title">${title}</div>
          <div class="forum-meta-data">
            <div class="forum-author">from: ${author.substring(0, 16)}</div>
            <p class="forum-channel">/c/${subreddit}</p>
          </div>
          <div class="forum-comments">
              <i class="icon-small fas fa-comment"></i>
              <span class="forum-comments-number">${comments}</span> Comments
          </div>
      </div>
      <div class="forum-voting">
          <i class="icon-small fas fa-arrow-up"></i>
          <div class="forum-score">${votes}</div>
          <i class="icon-small fas fa-arrow-down"></i>
      </div>
    </div>
  `;
}