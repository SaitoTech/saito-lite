module.exports = EscrowCryptoBalanceTemplate = (balance) => {
  return `
  <div class="crypto-balance-row">
    <div class="crypto-balance-ticker">${balance.ticker}</div>
    <div class="crypto-balance-balance">${balance.balance}</div>
  </div>
  `;
}
