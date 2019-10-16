module.exports = EmailAddTemplate = () => {
  return `
      <div class="email-content">
          <input class="email-title" type="text" placeholder="Title"/>
          <input class="email-address" type="text" placeholder="Address"/>

          <div style="display: flex">
            <input class="email-fee" type="number" default="2.0" placeholder="Fee"/>
            <input class="email-amount" type="number" default="0.0" placeholder="Amount"/>
          </div>

          <textarea class="email-text" placeholde="Message"></textarea>
          <button class="email-submit">SUBMIT</button>
      </div>
  `;
***REMOVED***