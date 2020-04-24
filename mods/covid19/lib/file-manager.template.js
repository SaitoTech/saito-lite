module.exports = FileManagerTemplate = () => {

  let html = '';

  html = `
  <div class="file-information">

    <h2>Files</h2>

    <p><hr /></p>

    <div class="loading">

      <p>
        Please be patient while we load the files. 
      </p>

    </div>

    <div id="file-table" class="file-table" style="display:none"></div>

    <p><hr /></p>

    <div class="flex-around">
       <div class="new-file-btn button">Add File</div>
    </div>
    
  </div>
  `;

  return html;

}
