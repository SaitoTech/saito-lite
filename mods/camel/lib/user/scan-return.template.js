module.exports = ScanReturnTemplate = (content) => {

  var html = `<html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="description" content="">
      <meta name="author" content="">
      <title>Saito Network: Provenance Prototype</title>
      <link rel="stylesheet" type="text/css" href="/saito/style.css" />
      <link rel="stylesheet" type="text/css" href="/camel/style.css" />

      <link rel="stylesheet" href="/saito/lib/font-awesome-5/css/all.css" type="text/css" media="screen">

      <link rel="icon" sizes="192x192" href="/saito/img/touch/pwa-192x192.png">
      <link rel="apple-touch-icon" sizes="192x192" href="/saito/img/touch/pwa-192x192.png">
      <link rel="icon" sizes="512x512" href="/saito/img/touch/pwa-512x512.png">
      <link rel="apple-touch-icon" sizes="512x512" href="/saito/img/touch/pwa-512x512.png"></link>

      </head> 
    <body>
      <div class="header header-home">
        <img class="logo major-logo" src="/camel/img/camel.png" />
        <img class="logo powered-by" src="/camel/img/dreamscape-logo.png" />
      </div>
      <div class="main">
      ${content}
      </div>
    </body>
  </html>  
`;
   return html;

}
