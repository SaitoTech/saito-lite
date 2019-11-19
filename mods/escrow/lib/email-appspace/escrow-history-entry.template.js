module.exports = EscrowHistoryEntryTemplate = (entry) => {
  return `
  <div class="crypto-history-entry">
    <div class="crypto-history-entry-ticker">${entry.ticker}</div>
    <div class="crypto-history-entry-action">${entry.action}</div>
    <div class="crypto-history-entry-balance">${entry.balance}</div>
  </div>
  `;
}
