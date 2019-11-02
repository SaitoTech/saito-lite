module.exports = HospitalHistoryTemplate = () => {
  return `

        <h2>Clinical Survey</h2>

        <div>Are you currently taking any medication?</div>

        <div>
          <input type="radio" name="current_medication" value="yes" /> yes
          <input type="radio" name="current_medication" value="no" /> no 
        </div>
 
        <div id="details" style="display:none" id="current_medication_details_div">
          <label for="current_medication">Please provide details:</label>
          <textarea name="current_medication_details" class="details_textarea"></textarea>
        </div>

  `;
}
