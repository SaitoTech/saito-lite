module.exports = EmailDetailTemplate = (selected_mail) => {
  return `
    <div>
      <div class="email-detail-addresses">
        <p>FROM:</p>
        <p>TO:</p>
      </div>
      <div class="email-detail-message">
        <p> New Message! </p>
      </div>
    </div>
  `;
}