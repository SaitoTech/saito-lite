
module.exports = TextSizer = {
  
  render(app, mod) {
    if(!document.getElementById("text-sizer")){
      let html = `
      <div id='text-sizer'>
      <div id="text-sizer-small" class="text-sizer-small">A</div>
      <div id="text-sizer-medium" class="text-sizer-medium">A</div>
      <div id="text-sizer-large" class="text-sizer-large">A</div>
      </div>
      <hr>`;
      app.browser.addElementToDom(html, 'settings-dropdown');
      this.attachEvents(app, mod);
    }
 
  },

  attachEvents(app, mod) {
      document.querySelector('.text-sizer-small').addEventListener('click', () => {
        document.body.style.fontSize = "0.8em";
      });
      document.querySelector('.text-sizer-medium').addEventListener('click', () => {
        document.body.style.fontSize = "1.0em";
      });
      document.querySelector('.text-sizer-large').addEventListener('click', () => {
        document.body.style.fontSize = "1.2em";
      });

  
  }
}