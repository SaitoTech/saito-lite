# Advanced Configuration - Customizing Your Saito Installation

## Table of Contents

* Configuration Files
* Common Configuration Issues
	* Change Server Host/Port/Protocol
	* Adding Peers
	* Add / Remove Modules


### Configuration Files

The basic Saito configuration files are location in the /config directory of your local installation. That directory contains some defaults that are used by the server during auto-config process. The following files will be generated once you start Saito for the first time:

/config/options
This is a JSON file that contains all of the configuration information for your node, including information on the state of the blockchain, the peers to which you want to connect, and information on where visitors to your website can find your server for connecting to the Saito blockchain (which may be different than the host serving web content!). This file also serves as the *wallet* for your node and includes your spent and unspent UTXO slips. In most situations you will only want to change / edit this file before starting the server. It is not recommended to tweak it in production.

/config/modules.config.js
This is a javascript file used during the Saito compilation process that specifies which modules get installed. Modules are sorted into two categories. *Core* modules are those that are installed onto your server/node, while *Lite* modules are those that are compiled into the javascript file your server will feed out to all visitors. Most modules are designed to run on both core and lite clients, but removing unnecessary modules from lite-clients can shrink the javascript and speed up the initial load times for new users grabbing Saito from your server.




### Common Configuration Issues

* Change Server Host/Port/Protocol

Your Saito server automatically generates a configuration/options file for the lite-clients that connect to it. These lite-clients will need to know the host / port / protocol they should use to connect to your blockchain node. If they cannot connect to the blockchain their applications will (usually) load but be unable to send transactions.

Your Saito server will automatically inform lite-clients of where to connect if their own ./config/options file contains a server object that specifies the necessary host/port/protocol information. If this information exists in your options file you can edit it. If it does not exist, you can add it as follows:

```
  "server": {
    "host":"localhost",
    "port":12101,
    "protocol":"http",
    "name":"Saito Community Server"
  }
```

Once you have made changes to your options file, be sure to recompile your javascript (npm run compile). You will want to purge your browser cache to ensure it downloads the updated information. If problems persists, try deleting the file /web/options.client if it exists - this file overwrites the system defaults so if it exists will override any changes you may have made by fixing your server options file. You can always check that your server is feeding a proper options file to your clients by visiting http://yourdomain.net:yourport/options

If you need to hardcode anything for the lite-clients that connect to your server you can also create the file /web/options.client and manually provide whatever options file you prefer. Only new clients will download this file. Existing clients will continue to use their previous version unless explicitly forced to refresh their wallet.


* Adding Peers

You can manually specify peers for your node to connect to by adding entries to the peers array in your options file. Your options file should have at least one peer defined. If you are servicing lite-clients, Saito will automatically list your server as the first peer when it generates the options file that is fed to its lite-clients.

```
  "peers" : [{
    "host":"saito.io",
    "port":12101,
    "protocol":"https",
  ]}
```

Once you have made changes to your options file, be sure to recompile your javascript (npm run compile). You will want to purge your browser cache to ensure it downloads the updated information. If problems persists, try deleting the file /web/options.client if it exists - this file overwrites the system defaults so if it exists will override any changes you may have made by fixing your server options file. You can always check that your server is feeding a proper options file to your clients by visiting http://yourdomain.net:yourport/options

If you need to hardcode anything for the lite-clients that connect to your server you can also create the file /web/options.client and manually provide whatever options file you prefer. Only new clients will download this file. Existing clients will continue to use their previous version unless explicitly forced to refresh their wallet.


* Adding/Removing Modules

If the file /config/modules.config.js exists, that is the file Saito will use to decide what modules you wish to run on your full-node, as well as which modules should be bundled into the saito.js file that is fed out to lite-clients.

```
module.exports = {
  core: [
    'arcade/arcade.js',
    'archive/archive.js',
    'chat/chat.js',
    'chess/chess.js',
    'email/email.js',
    'encrypt/encrypt.js',
    'myqrcode/myqrcode.js',
    'qrscanner/qrscanner.js',
    'relay/relay.js',
    'settings/settings.js',
    'website/website.js',
  ],
  lite: [
    'arcade/arcade.js',
    'archive/archive.js',
    'chat/chat.js',
    'chess/chess.js',
    'email/email.js',
    'encrypt/encrypt.js',
    'myqrcode/myqrcode.js',
    'qrscanner/qrscanner.js',
    'relay/relay.js',
    'settings/settings.js',
    'website/website.js',
  ]
}
```
Remove module by removing them from the relevant list. To add modules, download and install the relevant module in the /mods directory and then add a link to the main module in the format of the other modules in this list. 

Once you have made changes to your modules configuration file you will need to recompile your javascript (npm run compile) so that lite-clients get the updated version of the javascript with the new modules. You will need to restart the server if you are installing any new modules on it as well. 




