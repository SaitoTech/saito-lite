module.exports = SuggestTemplate = () => {
  
  return `
<div class="welcome-modal-wrapper">
  <div class="welcome-modal-action">
    <div class="welcome-modal-left">
      <div class="welcome-modal-header">Make a Suggestion</h1>
      </div>
      <div class="welcome-modal-main">
        <div style="margin:1em 0">Don't be shy - We listen to you!</div>
        <form name="suggest_form" id="suggest_form">
          <div style="display:flex;">
            <textarea type="text" style="background-color:#EEE;color:black;" id="suggestion" name="suggestion" placeholder="Leave your suggestion here."></textarea>
          </div>
        </form>
        <div id="empty_form_data" class="hidden"></div>
        <div><button id="suggest-modal-button" style="clear:both; margin:unset;margin-top:1em; margin-left:0px; min-width:16em; font-size:0.7em;background:#efefef;border:1px solid var(--saito-red);color: var(--saito-cyber-black);float:right;">Send</button>
        </div>
      </div>
      <div class="welcome-modal-info">
        <div class="tip"><b>Why get involved? <i class="fas fa-info-circle"></i></b>
          <div class="tiptext">Saito is a community - we welcome everyone and their contributions. Help us make Saito.io better.</div>
        </div>
      </div>
    </div>
  </div>
  <div class="welcome-modal-exit tutorial-skip">
    <p>
      I think everything is fine...
    </p>
    <p>
      Maybe later.
    </p>
    <i class="fas fa-arrow-right"></i>
  </div>
</div>
`;
}