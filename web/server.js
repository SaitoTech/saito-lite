// quick dev server if you want to test the client indpendent of the core codee

const express = require('express');
const app = express();

// This serves static files from the specified directory
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/img'));
app.use(express.static(__dirname + '/fonts'));
app.use(express.static(__dirname + '/assets'));

const server = app.listen(8081, () => {

  const host = server.address().address;
  const port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
