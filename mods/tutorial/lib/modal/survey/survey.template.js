module.exports = SurveyTemplate = () => {
  
  return `
  <div class="welcome-modal-wrapper">
    <div class="welcome-modal-action">
        <div class="welcome-modal-left">
            <div class="welcome-modal-header">Tell us why you are here!</h1>
            </div>
            <div class="welcome-modal-main">
                <div style="margin:1em 0">Tell us a little about you!</div>
                <form name="survey_form" id="survey_form">

                <div class="grid-2">
                    <div class="align-top">Why are you here?</div>
                    <div class="grid-2">

                        <input type="radio" id="crypto" name="why" value="crypto">
                        <label for="crypto">Crypto/Blockchain</label>

                        <input type="radio" id="freedom" name="why" value="freedom">
                        <label for="freedom">Open Unsensorable Network</label>

                        <input type="radio" id="games" name="why" value="games">
                        <label for="games">I'm here for the Games</label>

                        <input type="radio" id="other" name="why" value="other">
                        <input type="text" style="background-color:#EEE;color:#888;" id="other-reason-why" name="other-reason-why" placeholder="Other?"></input>
                    </div>
                    <div class="align-top">How did you get here?</div>
                    <div class="grid-2">

                        <input type="radio" id="reddit" name="how" value="reddit">
                        <label for="crypto">Reddit</label>

                        <input type="radio" id="twitter" name="how" value="twitter">
                        <label for="freedom">Twitter</label>

                        <input type="radio" id="other-how" name="how" value="other-how">
                        <input type="text" style="background-color:#EEE;color:#888;" id="other-reason-how" name="other-reason-how" placeholder="Other?"></input>

                    </div>
                </form>
                <div id="empty_form_data" class="hidden"></div>
                </div>
                <button id="survey-modal-button" style="clear:both; margin:unset; margin-left:0px; min-width:16em; font-size:0.7em;background:#efefef;border:1px solid var(--saito-red);color: var(--saito-cyber-black);float:right;">Send</button>            </div>
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
            I don't like Surveys.
        </p>
        <i class="fas fa-arrow-right"></i>
    </div>

</div>
  `;
}