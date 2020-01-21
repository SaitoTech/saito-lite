module.exports = [
    {
        id: "identifier",
        icon: "<i class='fas fa-user-tag'></i>",
        reward: 50,
        title: "Register Identifier",
        event: "register identifier",
        description: "Not a robot? You are eligible for tokens from the Saito faucet. Register an identifier to get started.",
        completed: false,
        action: function(app){app.modules.returnModule('Tutorial').registerIdentifierModal();},
    },
    {
        id: "backup",
        icon: "<i class='fas fa-download'></i>",
        reward: 50,
        title: "Backup Wallet",
        event: "user wallet backup",
        description:"Backup your wallet and we'll send you a heap of Saito tokens, enough to use the network for a long, long, time. Backing up your wallet is important as it provides you with the ability to restore your account.",
        completed: false,
        action: function(app){app.modules.returnModule('Tutorial').welcomeBackupModal();},
    },
    {
        id: "addcontact",
        icon: "<i class='fas fa-qrcode'></i>",
        reward: 50,
        title: "Add Contacts",
        event: "user add contact",
        description:"Sharing is great. Don't keep Saito to your self - tell your friends.",
        completed: false,
        action: function(app){app.modules.returnModule("Tutorial").inviteFriendsModal();},
    }
];

