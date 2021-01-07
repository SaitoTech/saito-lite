module.exports = ImageAppspaceTemplate = () => {

  return `

    <h3>Upload Image to Generate Base64 Text:</h3> 

    <p></p>

    <div id="image-text-input" class="image-text-input" style="border: 3px dashed #888; border-radius: 15px; width:400px;height:200px"></div>

    <p></p>

    <div style="max-width:100%;margin-top:10px;" id="image-text-output" class="image-text-output"></div>

  `;
}
