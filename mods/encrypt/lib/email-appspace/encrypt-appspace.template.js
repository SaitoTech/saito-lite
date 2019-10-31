module.exports = EmailAppspaceTemplate = () => {
  return `
<div class="email-appspace-encrypt">
  <h3>Encrypt transations and messages:</h3>
  <p>
    Enter a private key or address to perform an onchain Diffie-Hellman key exchange and encrypt your transactions.
  </p>
  <br />
  <div class="grid-2">
    <div>Address:</div>
    <div><input id="email-to-address" type="text" placeholder="Recipient Address"></div>
    <div></div>
    <div>
      <button class="email-submit">Encrypt</button>
    </div>
  </div>
</div> 
  `;
}
