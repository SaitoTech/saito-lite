module.exports = EscrowAppspaceTemplate = (escrow) => {

  let html = '';

  if (escrow.address == "") {

    html = `

    <h3>Escrow Service</h3>

    <p></p>

    <button class="escrow-create-btn">create deposit address</button>

    <p></p>

    Click the button above to generate an on-chain address for making deposits.

    `;

  } else {

    html = `

    <h3>Ecrow Service</h3>

    <p></p>

    BALANCE: ${escrow.balance}

    <p></p>

    DEPOSIT: ${escrow.address}

    <p></p>

    This is an experimental escrow service for cryptocurrency use-cases. It is a BETA SERVICE offered with NO GUARANTEES, not even the guarantee of continued service. Please do not deposit more than 20 USD worth of tokens. If you wish to make a withdrawal, click here. Withdrawals will be processed in approximately 24 hours.

    `;
  }

  return html;

}
