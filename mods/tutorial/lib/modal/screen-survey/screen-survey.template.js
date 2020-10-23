module.exports = ScreenSurveyTemplate = () => {
  
  return `
  <div class="welcome-modal-wrapper">
    <div class="welcome-modal-action">
        <div class="welcome-modal-left">
            <div class="welcome-modal-header">We'd like to make the Saito Experience Better!</h1>
            </div>
            <div class="welcome-modal-main">
                <div style="margin:1em 0">We'd like your browser or app to let us know how you are accessing Saito.<br /> We can use this information to make things shinier and smoother for you.</div>
                <form name="screen-survey_form" id="screen-survey_form">

                <div class="grid-2">
                    <div class="align-top">Browser information:</div>
                    <div class="agent-data grid-2">
                     
                    </div>
                             </form>
                <div id="empty_form_data" class="hidden"></div>
                </div>
                <button id="screen-survey-modal-button" style="clear:both; margin:unset; margin-left:0px; min-width:16em; font-size:0.7em;background:#efefef;border:1px solid var(--saito-red);color: var(--saito-cyber-black);float:right;">Send</button>            </div>
            <div class="welcome-modal-info">
                <div class="tip"><b>What is this anyway? <i class="fas fa-info-circle"></i></b>
                    <div class="tiptext">
                      The Saito team would like to know more about how and why people are coming to and using saito.io. We are not, and will never track you. Feel free to complete this form in a private browser and send yourself the proceeds. We'd just like to know how to spread the word about Saito.
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="welcome-modal-exit tutorial-skip">
        <p>
            Actually...
        </p>
        <p>
            I'd rather not.
        </p>
        <i class="fas fa-arrow-right"></i>
    </div>

</div>
  `;
}