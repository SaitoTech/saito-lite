module.exports =  elParser = (domstring) => {
  const html = new DOMParser().parseFromString(domstring, 'text/html');
  return html.body.firstChild;
}