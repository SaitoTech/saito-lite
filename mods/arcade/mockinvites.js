
let mockAddress = "zPwFAUi2S3AAUwhAxX19UAAUUisrrw9QtMTpwAC6w3fK";
let mockGame = { 
  "transaction": {
    "id": 9,
    "from": [
      {
        "add": mockAddress,
        "bid": 0,
        "tid": 0,
        "sid": 0,
        "bsh": "",
        "amt": "0",
        "type": 0,
        "lc": 1
      }
    ],
    "to": [
      {
        "add": mockAddress,
        "bid": 0,
        "tid": 0,
        "sid": 0,
        "bsh": "",
        "amt": "0",
        "type": 0,
        "lc": 1
      },
      {
        "add": mockAddress,
        "bid": 0,
        "tid": 0,
        "sid": 1,
        "bsh": "",
        "amt": "0",
        "type": 0,
        "lc": 1
      }
    ],
    "ts": 1605090741941,
    "sig": "2msmS9EjCrMeromNHpy4Yv8br3JT8wbFrmoGownu2ctvJRghLor6kz2DCmGT3sAwVwVEJJNBjTtwbgVXYFumHeHM",
    "ver": 1,
    "path": [
      {
        "from": mockAddress,
        "to": "ySSjMVrEqbtAAtcob5ZWDC2hZQ5Cj6zSC4Q4t1myosGd",
        "sig": "66ZAocz6VMwxpwhVA2h3vdMjgpQ5myTnm5kAJXLnXSvCbb912DWpzR19j1TqHr9CRejgahu5nBRSSwjS4aKSNLbf"
      }
    ],
    "r": 1,
    "type": 0,
    "m": "eyJ0cyI6MTYwNTA5MDc0MTg5MiwibW9kdWxlIjoiQXJjYWRlIiwicmVxdWVzdCI6Im9wZW4iLCJnYW1lIjoiQ2hlc3MiLCJvcHRpb25zIjp7ImNvbG9yIjoiYmxhY2siLCJjbG9jayI6IjAifSwib3B0aW9uc19odG1sIjoiPHNwYW4gY2xhc3M9XCJnYW1lLW9wdGlvblwiPmNvbG9yOiBibGFjazwvc3Bhbj4sIDxzcGFuIGNsYXNzPVwiZ2FtZS1vcHRpb25cIj5jbG9jazogMDwvc3Bhbj4iLCJwbGF5ZXJzX25lZWRlZCI6MiwicGxheWVycyI6WyJ6UHdGQVVpMlMzQUFVd2hBeFgxOVVBQVVVaXNycnc5UXRNVHB3QUM2dzNmSyJdLCJwbGF5ZXJzX3NpZ3MiOlsiNHpxb0trdDc1R2JOQ0Y5ck5hZjhNN3lCUFJCWm4xWkRmZDh0dFBxRnB6SzUyanRNVll4WFBiSnJUQk5Nd0Rybmtib251aW9KQndacTlVWGVlUG84dEE5bSJdfQ==",
    "ps": 0
  },
  "fees_total": "",
  "work_available_to_me": "",
  "work_available_to_creator": "",
  "work_cumulative": "0.0",
  "msg": {
    "ts": 1605090741892,
    "module": "Arcade",
    "request": "open",
    "game": "Chess",
    "options": {
      "color": "black",
      "clock": "0"
    },
    "options_html": "<span class=\"game-option\">color: black</span>, <span class=\"game-option\">clock: 0</span>",
    "players_needed": 2,
    "players": [
      mockAddress
    ],
    "players_sigs": [
      "4zqoKkt75GbNCF9rNaf8M7yBPRBZn1ZDfd8ttPqFpzK52jtMVYxXPbJrTBNMwDrnkbonuioJBwZq9UXeePo8tA9m"
    ]
  },
  "dmsg": "",
  "size": 1277,
  "is_valid": 1,
  "atr_trapdoor": "00000000000000000000000000000000000000000000",
  "atr_rebroadcasting_limit": 10
}
function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
function randomModule() {
  let mods = ["Wordblocks", "Chess", "Twilight", "Poker", "Imperium"];
  return mods[Math.floor(Math.random() * mods.length)]
}
function randomPlayersNeeded() {
  let playersNeeded = [2,4,6,8];
  return playersNeeded[Math.floor(Math.random() * playersNeeded.length)]
}
function randomlyMe(app) {
  return Math.floor(Math.random() * 2) ? mockAddress : app.wallet.returnPublicKey();
}

module.exports = getMockGames = (app) => {
  let mockgames = [];
  let howMany = Math.floor(Math.random() * 40);
  for(let i = 0; i < howMany; i++) {
    mockgames.push(JSON.parse(JSON.stringify(mockGame)));
  }
  mockgames.forEach((mg, i) => {
    mg.transaction.sig = makeid(1);
    mg.msg.game = randomModule();
    mg.msg.players_needed = randomPlayersNeeded();
    mg.msg.players[0] = randomlyMe(app);
  });
  return mockgames;
}