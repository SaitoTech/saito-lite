module.exports = RegistryAppspaceTemplate = () => {
  return `
<div class="email-appspace-registry">
<h3>Register an human address:</h3>
<div class="grid-2">
  <div>Address:</div>
  <div><input id="identifier-requested" class="identifier-requested" type="text" placeholder="Your nickname or handle (what comes before the @)"></div>
</div>  
<button class="registry-submit" id="registry-submit">register</button>
  `;
}
