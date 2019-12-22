module.exports = {
    host: "smtp.sendgrid.net",
    port: 2525,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: "apikey",
      //user: "YXBpa2V5",
      pass: "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"
      //pass: "U0cuMWxubWJUYldTVFcxRlFrdTVqbFR6dy5vTkYzZGQ5cFhuQjBwUVQ3TnpiSkU0dUJDVC1MYVRxc0NGb1B3aGJZQW1z"
    }/*,
      tls: {
         // do not fail on invalid certs
         rejectUnauthorized: false,
         ciphers:'SSLv3'
      }*/
};