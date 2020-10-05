module.exports = RewardsAppspaceTemplate = (app) => {
  return `
    <!--link rel="stylesheet" href="/rewards/style.css"-->
    <!--i class="rewards-back fas fa-arrow-circle-left"></i-->
    <style>
        .rewards-grid-row {
          display: grid;
          grid-gap: 1em;
          grid-template-columns: 3em 3em auto 3em;
          cursor: pointer;
          padding: 1em;
        }
        
        .rewards-grid-row:hover {
          background-color: #8888;
        }
        
        .rewards-grid-icon i, .rewards-grid-reward, .rewards-grid-completed {
          font-size: 2em;
        }
        
        .rewards-grid-icon {
          margin: 0.6em auto;
        }
        
        .rewards-grid-reward {
          margin: 0.35em auto;
        }

        .rewards-status {
          display: grid;
          grid-gap: 1em;
          font-size: 1.2em;
          grid-template-columns: auto auto auto auto;
          margin: 1em 0 2em 0;

        }
        .referral-status {
          display: grid;
          grid-template-columns: auto 6em 7em;
          gap: 1em;
        } 
        .total-earned-content {
          margin: 1em 0;
        }
        .invite-link {
          display: grid;
          grid-template-columns: 7em auto 2em;
          align-items: center;
          font-size: 1.25em;
          gap: 1em;
      }
        i.fas.fa-copy {
          border: 1px solid white;
          border-radius: 2em;
          padding: 0.5em;
      }
      .fa, .fas {
    </style>
    <div class="email-appspace-rewards">
      <h2>Saito Network Rewards</h2>
      <p>
        The Saito Rewards System rewards you for spending money (sending fee paying transactions) on the network. The more you use the network - the greater the rewards.
      <div class="rewards-status">
        <center><div class="loader"></div></center>
      </div>
      
      <hr />
      <h3>Referral Rewards</h3>   
      <div class="referral-status">
      <center><div class="loader"></div></center>
    </div>
    <div class="right total-earned"></div>
    <div class="invite-link"></div>
    <hr />
      <h3>Extra Reward Activities</h3>
    <div class="rewards-grid"></div>
  `;
}
