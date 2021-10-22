
module.exports = TextSizer = {
  
  render(app, mod) {
    if(!document.getElementById("text-sizer")){
      let html = `
      <div class="wallet-action-row">
      <div id="text-sizer">
        <table class="text-sizer-table">
          <thead>
            <tr>
              <td><div class="fas fa-text-height"></div></td>
              <td><div id="text-sizer-small" class="text-sizer-small">A /</div></td>
              <td>
                <div id="text-sizer-medium" class="text-sizer-medium">A /</div>
              </td>
              <td><div id="text-sizer-large" class="text-sizer-large">A</div></td>
            </tr>
          </thead>
        </table>
      </div>
    </div>
    <hr />`;
      app.browser.addElementToDom(html, 'settings-dropdown');
      this.attachEvents(app, mod);
    }
 
  },

  attachEvents(app, mod) {
      document.querySelector('.text-sizer-small').addEventListener('click', () => {
        document.body.style.fontSize = "1em";
      });
      document.querySelector('.text-sizer-medium').addEventListener('click', () => {
        document.body.style.fontSize = "1.2em";
      });
      document.querySelector('.text-sizer-large').addEventListener('click', () => {
        document.body.style.fontSize = "1.5em";
      });
  }
}