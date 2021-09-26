const ModTemplate = require('../../lib/templates/modtemplate');

class EmailCollector extends ModTemplate {
  // TODO: Should this be a service? The way we support services at this point, 
  // I think it's not really necessary but we are spamming services.saito.io with
  // the peer requests meant for this guy(or vice versa, depending out how we set this up on prod...)
  constructor(app) {

    super(app);
    this.name            = "EmailCollector";
    this.description     = "Basic module for collecting email addresses";
    this.categories      = "Utility";
    return this;
  }

  initialize() {
    
  }
  
  returnServices() {
    let services = [];
    services.push({ service: "emailcollector", domain: "saito" });
    return services;
  }
  async handlePeerRequest(app, message, peer, callback) {
    
    if (message.request == "public sale signup") {
      try {

        let sql = "INSERT OR IGNORE INTO publicsale (publickey, email, unixtime) VALUES ($publickey, $email, $unixtime);"

        let params = {
          $publickey: message.data.msg.key,
          $email: message.data.msg.email,
          $unixtime: message.data.msg.time,
        }

        await app.storage.executeDatabase(sql, params, "emailcollector");
        return;

      } catch (err) {
        console.error(err);
      }
    }

    if (message.request == "newsletter signup") {
      try {
        let sql = "INSERT OR IGNORE INTO newsletter (publickey, email, unixtime) VALUES ($publickey, $email, $unixtime);";
        let params = {
          $publickey:   message.data.msg.key,
          $email:  message.data.msg.email,
          $unixtime:    message.data.msg.time
        }

        await app.storage.executeDatabase(sql, params, "emailcollector");

        // Send Email
        app.network.sendRequest('send email', {
          from: 'network@saito.tech',
          to: params.$email, 
          subject: 'Newsletter Subscription',
          ishtml: false,
          body: `Thank you for subscribing to Saito's newsletter.`
        });

        return;

      } catch (err){
        console.log(err);
      }
    }
  }

}

module.exports = EmailCollector;

