
This test suite is presented as a Saito game module.

To install this module:

1. Install Saito Lite as per [the instructions](https://org.saito.tech/installation-instructions/).

1. Copy this (the gametestsuite) directory into /mods

1. Edit /config/modules.config.js to include ```'gametemplate/gametemplate.js'``` this module in both core/lite distributions<br />

1. recompile the javascript: ```npm run nuke```

1. restart the saito node: ```npm start```


Example minimal modules.config.js for testing:

---
module.exports = {
  core: [
    'explorer/explorer.js',
    'registry/registry.js',
    'settings/settings.js',
    'arcade/arcade.js',
    'gametestsuite/gametestsuite.js'
  ],
  lite: [
    'registry/registry.js',
    'arcade/arcade.js',
	'gametestsuite/gametestsuite.js'
    ]
}
