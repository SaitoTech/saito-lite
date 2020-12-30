module.exports = AppStorePublishSuccessTemplate = () => {
  return `
    <div style="margin-top:10px;">

    <h2>Module Submitted</h2>

    <p>
    You have uploaded your application to the Saito Network. It will take a few minutes for it to be indexed by the network and made available for you and others to install. You will receive an email once your application is indexed and ready to release.
    </p>

    <p>
      <br/>
    </p>

    <p>
    In the event you do not receive this email, it indicates that your application does not compile properly and there was an error indexing it. If that happens, please visit our <a href="https://org.saito.tech/developer">Saito developer center</a> for assistance. Most problems can be easily found and debugged by compiling manually on a local install. You are also always welcome to reach out to us for assistance. To return to your inbox and check to see if your application is available yet, please click the button below.
    </p>

    <p>
      <br/>
    </p>

    <div style="text-align:center;width:100px;" class="button return-to-inbox">return to inbox</div>

    </div>
  `;
}
