export const WalletTemplate = wallet => {
    return `
        <div class="welcome container">
            <div id="qrcode"></div>
            <div class="wallet-container">
                <div class="wallet-container-row">
                    <span>Balance:</span>
                    <span>${wallet.balance***REMOVED***</span>
                </div>
                <div class="wallet-container-row">
                    <span>Address:</span>
                    <span>${wallet.id***REMOVED***</span>
                </div>
                <button class="register-button">REGISTER ID</button>
            </div>
        </div>
    `;
***REMOVED***
