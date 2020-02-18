module.exports = AppStoreBundleConfirmTemplate = (publickey) => {

  return `


  The AppStore identified by publickey ${publickey} has generated a new Saito bundle for you.

  <p></p>

  Do you wish to use this new version of Saito?

  <p></p>

  <button id="confirm-bundle-install-btn" class="confirm-bundle=-install-btn" name="confirm">confirm</button>

</div>
  `;
}
