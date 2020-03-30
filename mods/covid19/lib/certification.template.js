module.exports = CertificationTemplate = () => {

  let html = '';

  html = `
  <div class="certification">
    <input id="certification-id" type="hidden" />
    <h2>Add/Edit Certification</h2>
    <div class="grid-2">
      <div>Certification Name</div>
      <div class="certifications">
        <select id="certifications-list"></select>
      </div>
      <div></div>
      <div><input type="text" placeholder="Add new certification" /></div>
      <div></div>
      <button id='save-certification' class='save-certification'>Save Certification</button>
      </div>
  </div>
  `;

  return html;

}