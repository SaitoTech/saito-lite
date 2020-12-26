module.exports = AppStoreBundleConfirmTemplate = (publickey) => {

  return `


  The AppStore at ${publickey} has generated a new Saito bundle for you. Use it?

  <p></p>

  <button id="confirm-bundle-install-btn" class="confirm-bundle=-install-btn" name="confirm">confirm</button>

</div>
  `;
}
