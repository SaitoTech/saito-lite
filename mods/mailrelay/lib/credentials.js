module.exports = {
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true, // upgrade later with STARTTLS
    auth: {
//      user: "YXBpa2V5",
//      pass: "U0cuUDdKSHpYMGxSSVdHa2RuUlROSDJTQS5IZlNlVGpqR0pDbTNWbENOT0Y4R2lJRG52TDlvX1hBRWxpLUFWbXQ2a05V"
//      user: "RichardParris",
//      pass: "O@eFv^6OFfg3CnWZ98e1OE7frxwiSFt*W@",
      user: "apikey",
      pass: "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"
    }/*,
      tls: {
         // do not fail on invalid certs
         rejectUnauthorized: false,
         ciphers:'SSLv3'
      }*/
};