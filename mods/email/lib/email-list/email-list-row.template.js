module.exports = EmailListRowTemplate = ({title, message, timestamp, sig}) => {

  let datetime = new Date(timestamp);
  let hours = datetime.getHours();
  let minutes = datetime.getMinutes();
  minutes = minutes.toString().length == 1 ? `0${minutes}` : `${minutes}`;

  message = message.length > 64 ? `${message.substring(0, 64)}...`: message;

  return `
  <div class="email-message" id="${sig}">
      <input class="email-selected" type="checkbox">
      <div class="email-message-content"">
          <h3>${title}</h3>
          <p class="emai-message-message">${message}</p>
      </div>
      <p class="email-message-timestamp">${hours}:${minutes}</p>
  </div>`
};
