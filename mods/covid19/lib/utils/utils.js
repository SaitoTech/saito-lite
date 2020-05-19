const jsZip = require('jszip');
const FileSaver = require('file-saver');


module.exports = utils = {

  renderDocs(product_id, el) {
    var _this = this;
    var target = el;
    var allrows = []
    var sql = `
          select 
            c.name as 'Name', 
            note, 
            pc.id as 'id',
            'certifications' as 'source'
          from 
            certifications as 'c' 
          JOIN 
            products_certifications as 'pc'
          where 
            c.id = pc.certification_id and pc.product_id = ${product_id};
    
          UNION ALL

          select
            distinct(files.file_filename) as Name,
            files.file_type as 'note',
            files.id,
            "files" as source,
          from
            files JOIN file_attachments
              on  files.id = file_attachments.file_id
          where
            file_attachments.object_table = 'products' and
            file_attachments.object_id = ${product_id}
        `;

    this.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {

      if (res.rows.length > 0) {
        _this.renderCerts(res.rows, target);
      }
      if (res.rows.length > 1) {
        _this.renderDownloadAll(product_id, target);
      }
    });
  },

  async returnZipForProduct(product_id) {
    var _this = this;
    var sql = `
      select
        pc.file_filename as 'filename',
        pc.file as 'data'
     from 
        products_certifications as pc
     where pc.product_id = ${product_id}

     UNION ALL
     
     select
        files.file_filename as 'filename',
        files.file_data as 'data' 
      from 
        files 
      join 
        file_attachments on files.id = file_attachments.file_id
      where 
        file_attachments.object_table = 'products'
      and
        file_attachments.object_id = ${product_id}
    `;

    var result = [];

    await this.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {

      if (res.rows.length > 0) {
        _this.zipRows(res.rows);
      }
    });

  },

  zipRows(rows) {

    var zip = new jsZip();

    rows.forEach(row => {
      zip.file(row.filename, row.data.split(',')[1], { base64: true });
    });
    zip.generateAsync({ type: 'blob' }).then(function (content) {
      FileSaver.saveAs(content, 'certificates.zip');
    });

  },

  returnZipForOrder(order_id) {
    var zip = new jsZip();
    document.getElementById('downloader').classList.remove('fa-download');
    document.getElementById('downloader').classList.add('fa-spinner');
    document.getElementById('downloader').classList.add('fa-spin');
    var sql = `
select * from
(select
  categories.name || "-" || products_certifications.product_id as 'folder',
  certifications.name || "-" || products_certifications.file_filename as 'file_name',
  products_certifications.file as 'file_data'
 FROM
  categories
  JOIN 
  items ON (items.category_id = categories.id and items.order_id = ${order_id})
  JOIN 
  products_items on items.id = products_items.item_id
  JOIN 
  products_certifications on products_items.product_id = products_certifications.product_id
  JOIN
  certifications on certifications.id = products_certifications.certification_id
  
  UNION ALL
  
  select
  categories.name || "-" || products_items.product_id as 'folder',
  files.file_filename as 'file_name',
  files.file_data as 'file_data'
 FROM
  categories
  JOIN 
  items ON (items.category_id = categories.id and items.order_id = ${order_id})
  JOIN 
  products_items on items.id = products_items.item_id
  JOIN 
  file_attachments on (file_attachments.object_id = products_items.product_id and file_attachments.object_table = 'products') 
  JOIN
  files on files.id = file_attachments.file_id)
  order by folder asc, file_name asc
    `;

    this.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {

      if (res.rows.length > 0) {
        res.rows.forEach(row => {
          let filename = row.folder + "/" + row.file_name.replace(/\ /, "_");
          let filedata = row.file_data;
          if (filedata.includes(",")) { filedata = filedata.split(",")[1]; }
          zip.file(filename, filedata, { base64: true });
        });
        zip.generateAsync({ type: 'blob' }).then(function (content) {
          FileSaver.saveAs(content, 'dhb_order_files.zip');
        });
        document.getElementById('downloader').classList.remove('fa-spinner');
        document.getElementById('downloader').classList.remove('fa-spin');
        document.getElementById('downloader').classList.add('fa-download');
      }
    });


  },

  renderDownloadAll(product_id, el) {
    //if(el.childNodes.length > 1) {
    var _this = this;
    var id = product_id;
    var button = document.createElement('button');
    button.innerHTML = "Download All"
    button.classList.add('cert');
    button.classList.add('download_all');
    button.addEventListener('click', (e) => {
      _this.returnZipForProduct(id);
    });
    el.appendChild(button);
    //}
  },


  renderCerts(rows, el) {
    // should this be generalised to module wide?
    var _this = this;

    rows.forEach(row => {

      var html = "";

      //
      // certifications
      //
      if (row["source"] == "certifications") {

        var note = "";
        if (row["note"]) { note = "<div class='tiptext'>" + row["note"] + "</div>"; }
        if (row["id"] != null && _this.isAdmin()) {
          html += "<div class='cert tip'><a class='attach-cert-" + row["id"] + "'>" + row["Name"] + "</a>" + note;
          html += " <i data-id='" + row["id"] + "' id='delete-cert-" + row["id"] + "' class='fright far fa-times-circle'></i></div>";
        } else {
          html += "<div class='cert tip'><a target='_blank' href='/covid19/dummy.pdf'>" + row["Name"] + "</a><div class='tiptext'> Certification available on recipet of formal purchase order. </div></div>";
        }

        el.append(elParser(html));

      }

      //
      // bundles
      // this may not work right now.
      if (row["source"] == "files") {

        console.log("FILE: " + JSON.stringify(row));

        var note = "";
        if (row["note"]) { note = "<div class='tiptext'>supplementary file</div>"; }
        if (row["product_id"] != null) {
          html += "<div class='cert tip'><a class='attach-file-" + row["id"] + "'>" + row["Name"] + "</a></div>";
        } else {
          html += "<div class='cert tip'><a target='_blank' href='/covid19/dummy.pdf'>" + row["Name"] + "</a></div>";
        }
        el.append(elParser(html));
      }
    });

    //add actions - limited to admins right now
    if (_this.isAdmin()) {
      rows.forEach(row => {
        if (row["source"] == "certifications") {
          el.querySelector('.attach-cert-' + row["id"]).addEventListener('click', (e) => {
            _this.returnCertFile(row["id"]);
          });
          if (_this.isAdmin()) {
            el.querySelector('#delete-cert-' + row["id"]).addEventListener('click', (e) => {
              _this.returnCertFile(row["id"]);
            });
          }
        }
        if (row["source"] == "files") {
          el.querySelector('.attach-file-' + row["id"]).addEventListener('click', (e) => {
            _this.returnFile(row["id"]);
          });
        }
      });
    }
  },

  returnCertFile(id) {
    this.sendPeerDatabaseRequest("covid19", "products_certifications", "*", "id = " + id, null, function (res) {
      if (res.rows.length > 0) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = [res.rows[0]["file"]];
        a.download = res.rows[0]["file_filename"];
        a.click();
        a.destroy();
      }
    });
  },

  returnFile(id) {
    this.sendPeerDatabaseRequest("covid19", "files", "*", "id= " + id, null, function (res) {
      if (res.rows.length > 0) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = res.rows[0]["file_data"];
        a.download = res.rows[0]["file_filename"];
        a.click();
        a.destroy();
      }
    });
  },

  returnAttachment(id) {
    this.sendPeerDatabaseRequest("covid19", "attachments", "*", "id= " + id, null, function (res) {
      if (res.rows.length > 0) {
        var blob = new Blob([res.rows[0]["attachment_data"]], { type: res.rows[0]["attachment_type"] });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = url;
        a.download = res.rows[0]["attachment_filename"];
        a.click();
        window.URL.revokeObjectURL(url);
        a.destroy();
        salert("Download attachment: " + res.rows[0]["attachment_filename"]);
      }
    });
  },

  treatBoolean(el) {
    let cell = el.id;
    let html = `
          <input class="check-${cell}" id="check-${cell}" type="checkbox">
          `;
    el.parentNode.innerHTML += html;
    el = document.getElementById(el.id);
    el.classList.add('hidden');

    if (el.value == 1) {
      document.getElementById(`check-${cell}`).checked = true;
    }

    document.getElementById(`check-${cell}`).addEventListener('change', (e) => {
      if (e.target.checked) {
        el.value = 1;
      } else {
        el.value = 0;
      }
    });

  },

  treatTextArea(el) {
    let cell = el.id;
    let html = `
          <textarea class="text-${cell}" id="text-${cell}"></textarea>
          `;
    el.parentNode.innerHTML += html;
    el = document.getElementById(el.id);
    el.classList.add('hidden');

    document.getElementById(`text-${cell}`).value = el.value;

    var editor = new MediumEditor(`#text-${cell}`, {
      placeholder: false,
      buttonLabels: 'fontawesome',
      toolbar: {
        allowMultiParagraphSelection: true,
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote', 'li'],
        diffLeft: 0,
        diffTop: -10,
        firstButtonClass: 'medium-editor-button-first',
        lastButtonClass: 'medium-editor-button-last',
        relativeContainer: null,
        standardizeSelectionStart: false,
        static: false,
        updateOnEmptySelection: true,
        anchor: {
          customClassOption: null,
          customClassOptionText: 'Button',
          linkValidation: true,
          placeholderText: 'Paste or type a link',
          targetCheckbox: true,
          targetCheckboxText: 'Open in new window'
        }
      }
    });

    document.querySelector(`div.text-${cell}`).addEventListener('blur', (e) => {
      el.value = document.querySelector(`div.text-${cell}`).innerHTML;
    });

  },

  treatPhoto(el) {

    let cell = el.id;
    let html = `
          <div class="product-image-holder" id="img-holder-${cell}">
            <img class="product-image" id="img-${cell}" src="${el.value}" />
          </div>
          <input class="products-${cell}" id="file-${cell}" type="file">
          `;
    el.parentNode.innerHTML += html;
    //when rewriting the partent innerhtml - the element reference is lost.
    el = document.getElementById(el.id);
    el.classList.add('hidden');

    document.getElementById(`file-${cell}`).addEventListener('change', (e) => {
      var img = document.getElementById(`img-${cell}`);
      var reader = new FileReader();
      var file = e.target.files[0];
      var original = new Image();
      original.onload = function () {
        var w = 0;
        var h = 0;
        var r = 1;

        var canvas = document.createElement('canvas');

        if (original.width > 450) {
          r = 450 / original.width;
        } if (r * original.height > 300) {
          r = 300 / original.height;
        }
        w = original.width * r;
        h = original.height * r;

        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(original, 0, 0, w, h);
        var result = canvas.toDataURL(file.type);
        img.src = result;
        el.value = result;
      }
      reader.addEventListener("load", function () {

        original.src = reader.result;

      }, false);
      reader.readAsDataURL(file);
    });

    document.getElementById(`img-holder-${cell}`).addEventListener('click', e => {
      document.getElementById(`file-${cell}`).click();
    });

  },

  treatACDropDown(el, dbtable, idcol, valuecol) {

    let cell = el.id;
    let html = "";
    var options = "";
    this.sendPeerDatabaseRequest("covid19", dbtable, idcol + " as 'id', " + valuecol + " as 'value'", "deleted <> 1", null, function (res) {
      res.rows.forEach(opt => {
        options += `<option data-value="${opt.id}" value="${opt.value}"></option>`
      });
      html += `
          <input type="text" id="${dbtable}-display" list="${dbtable}-options" placeholder="Click or type...">
          <datalist id="${dbtable}-options">${options}</datalist>
        `;
      el.parentNode.innerHTML += html;
      el = document.getElementById(el.id);
      el.classList.add('hidden');

      if (el.value.length > 0) {
        document.getElementById(`${dbtable}-display`).value = document.querySelector(`#${dbtable}-options [data-value='${el.value}']`).value;
      }

      document.getElementById(`${dbtable}-display`).addEventListener("change", (e) => {
        el.value = document.querySelector(`#${dbtable}-options [value='${e.target.value}']`).dataset.value;
      });

      document.getElementById(`${dbtable}-display`).addEventListener("focus", (e) => {
        e.target.value = "";
        e.target.click();
        e.target.click();
      });

    });

  },

  treatHide(el) {
    el.parentNode.previousSibling.classList.add('hidden');
    el.parentNode.classList.add('hidden');
  },

  treatFile(el, typeel = null, nameel = null) {
    let cell = el.id;
    let html = `
         <div id="certification_display" class="file-display">No file Selected</div>
         <input class="file-${cell}" id="file-${cell}" type="file">
          `;
    el.parentNode.innerHTML += html;
    //when rewriting the partent innerhtml - the element reference is lost.
    el = document.getElementById(el.id);
    el.classList.add('hidden');
    var displayEl = document.querySelector("#certification_display");
    if (el.value != "") {
      if (typeel.value.split("/")[0] == "image") {
        displayEl.innerHTML = "<div class='product-image-holder'><img class='product-image' alt='certification file' src='" + el.value + "'/></div>";
      } else {
        displayEl.innerHTML = typeel.split("/")[1].toUpperCase();
      }
    }

    var input = document.getElementById(`file-${cell}`);
    input.addEventListener('change', (e) => {
      var reader = new FileReader();
      var file = e.target.files[0];
      reader.addEventListener("load", function () {

        if (file.type.split("/")[0] == "image") {
          displayEl.innerHTML = "<div class='product-image-holder'><img class='product-image' alt='certification file' src='" + reader.result + "'/></div>";
        } else {
          displayEl.innerHTML = file.type.split("/")[1].toUpperCase();
        }
        el.value = reader.result;
        if (nameel) { nameel.value = file.name };
        if (typeel) { typeel.value = file.type };
      }, false);
      reader.readAsDataURL(file);
    });
    document.querySelector("#certification_display").addEventListener('click', e => {
      input.click();
    });

  },


  pdfCap(inputHTML, filename) {
    var shim = document.createElement('div');
    shim.style.width = "1120px";
    shim.style.height = "1475px";
    shim.style.padding = "100px"
    shim.style.position = "absolute";
    shim.style.top = "-2000px;"
    //shim.appendChild(targetel.cloneNode(true));
    shim.classList.add('toprint');
    shim.innerHTML = inputHTML;
    document.querySelector('.footer').appendChild(shim);
    const html2canvas = require('html2canvas');
    const jsPDF = require('jspdf');
    const domElement = shim;
    html2canvas(domElement, {
      onclone: (document) => {
        //document.getElementById('print-button').style.visibility = 'hidden';
      }
    })
      .then((canvas) => {
        console.log(canvas.width + " " + canvas.height);
        var imgData = canvas.toDataURL('image/jpeg', 1);

        // console.log('Report Image URL: ' + imgData);
        var doc = new jsPDF('p', 'mm', "a4");
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        doc.addImage(imgData, 'jpeg', 0, 0, pdfWidth, pdfHeight);

        doc.save(filename);
        shim.destroy();
      });
  }


}