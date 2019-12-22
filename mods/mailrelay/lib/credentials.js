module.exports = {
    host: "",
    port: 0,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: "",
      pass: ""
    },
      tls: {
         // do not fail on invalid certs
         rejectUnauthorized: false,
         ciphers:'SSLv3'
      }
};
