export const ForumAddTemplate = () => {
  return `
    <form id="forum-add-post">
      <section>
        <h2>Title</h2>
        <input id="forum-title" type="text" placeholder="Title">
      </section>
      <section>
        <h2>URL</h2>
        <input id="forum-url" type="text" placeholder="URL">
      </section>
      <section>
        <h2>Discussion</h2>
        <textarea id="forum-discussion"></textarea>
        <button id="forum-toggle">Toggle</button>
      </section>
      <section>
        <h2>Channel</h2>
        <input id="forum-channel" type="text" placeholder="Channel">
      </section>
      <button id="forum-submit">SUBMIT</button>
    </form>
  `;
}