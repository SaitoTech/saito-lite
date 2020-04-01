module.exports = CertificationTemplate = () => {

  let html = '';

  html = `
  <div class="certification">
    <input data-id="new" data-table="products_certifications" data-column="product_id" id="pc_product_id" type="hidden" />
    <input data-id="new" data-table="products_certifications" data-column="certification_id" id="pc_certification_id" type="hidden" />
    <h2>Add/Edit Certification</h2>
    <div class="grid-2">
      <div>Certification Name</div>
      <div class="certifications">
        <select data-ignore="true" id="certifications-list"></select>
      </div>
      <div></div>
      <div><input data-id="" data-ignore="false" id="certification_name" style="display:none;" data-table="certifications" data-column="name" type="text" placeholder="Add new certification" /></div>

      <div>Product Image</div>
      <div>
        <div id="certification_display" class="file-display">No file Selected</div>
        <input data-ignore="true" id="certification_file" type="file" />
      </div>

      <div>
        <input data-id="new" style="display:none;" id="certification_file_data" data-table="products_certifications" data-column="file" style="display:block;" />
        <input data-id="new" style="display:none;" id="certification_file_name" data-table="products_certifications" data-column="file_filename" style="display:block;" />
        <input data-id="new" style="display:none;" id="certification_file_type" data-table="products_certifications" data-column="file_type" style="display:block;" />
      </div>
      <button id='save-certification' class='save-certification'><i class="fas fa-link"></i>  Add/Update Certification</button>
      </div>
  </div>
  `;

  return html;

}