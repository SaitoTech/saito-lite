
  let x = "quick test of encoding";
  let y = 
  let z = Buffer.from(x, 'utf16le').toString('utf8');

transaction.msg = "BASE64STRING";


console.log(z);

