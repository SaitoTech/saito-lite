module.exports = AppStorePublishSuccessTemplate = () => {
  return `
    <div style="margin-top:10px;">

    <h2>Module Submitted</h2>

    <p></p>

    It will take a few minutes for your application to be indexed by the AppStores on the network and be available for other users to install. Once this is done, you will receive an email with your unique APP-ID along with a link you can use to install the application. Share this APP-ID/link so your friends can install it.

    <p></p>

    If you do not receive this email, it indicates that your application does not compile properly. Please consult the Developer section on the Saito website for assistance setting up a local Saito node for assistance debugging your application.

    <p></p>


    </div>
  `;
}
