module.exports = EmailListRowTemplate = (tx) => {

  let message 	= tx.transaction.msg.message;
  let title   	= tx.transaction.msg.title;
  let timestamp = tx.transaction.ts;
  let sig 	= tx.transaction.sig;

  let datetime = new Date(timestamp);
  let hours = datetime.getHours();
  let minutes = datetime.getMinutes();
  minutes = minutes.toString().length == 1 ? `0${minutes***REMOVED***` : `${minutes***REMOVED***`;

  message = message.length > 64 ? `${message.substring(0, 64)***REMOVED***...`: message;

  return `
  <div class="email-message" id="${sig***REMOVED***">
      <input class="email-selected" type="checkbox">
      <div class="email-message-content"">
          <h3>${title***REMOVED***</h3>
          <p class="emai-message-message">${message***REMOVED***</p>
      </div>
      <p class="email-message-timestamp">${hours***REMOVED***:${minutes***REMOVED***</p>
  </div>`
***REMOVED***;
