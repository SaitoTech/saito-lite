module.exports = AppStorePublishSuccessTemplate = () => {
  return `
    <div style="margin-top:10px;">

    <h2>Module Submitted</h2>

    <p>
    You have uploaded your application to the Saito Network. It will take a few minutes for your application to be indexed by the network and made available for install. You will receive an email once your application is ready to install.
    </p>

    <p> </p>

    <p>
    If you do not receive this email, it indicates that your application does not compile properly. Please consult the Developer section on the Saito website for assistance. To return to your inbox and check to see if your application is available yet, please <span class="return_to_inbox">click here</span>.
    </p>

    </div>
  `;
}
