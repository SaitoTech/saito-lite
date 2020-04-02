module.exports = ReviewListTemplate = () => {

  let html = '';

  html = `
  <div class="splash-introduction">

    <h2>Signed Attestations Regarding Supplier:</h2>

    <div class="loading">

      We are currently loading signed messages...

      <p></p>

      This may take a minute.

      <p></p>

      Please be patient.

    </div>

    <div class="portal" style="display:none">

      This page is under active development.

    </div>
  </div>
  `;

  return html;

}
