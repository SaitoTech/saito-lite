
module.exports = ArcadeInviteTemplate = (app, mod, invite, idx) => {
  let playersHtml = "";
  for(let i = 0; i < invite.msg.players_needed; i++) {
    //TODO: implement this!!
    playersHtml+= ``;
  }
  //DELETE ME
  playersHtml += `<div class="player-slot tip"><img class="identicon" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MjAnIGhlaWdodD0nNDIwJyBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjpyZ2JhKDI0MCwyNDAsMjQwLDEpOyc+PGcgc3R5bGU9J2ZpbGw6cmdiYSgzOCwyMTcsMTk5LDEpOyBzdHJva2U6cmdiYSgzOCwyMTcsMTk5LDEpOyBzdHJva2Utd2lkdGg6Mi4xOyc+PHJlY3QgIHg9JzE2OCcgeT0nMTY4JyB3aWR0aD0nODQnIGhlaWdodD0nODQnLz48cmVjdCAgeD0nODQnIHk9JzI1Micgd2lkdGg9Jzg0JyBoZWlnaHQ9Jzg0Jy8+PHJlY3QgIHg9JzI1MicgeT0nMjUyJyB3aWR0aD0nODQnIGhlaWdodD0nODQnLz48cmVjdCAgeD0nODQnIHk9JzMzNicgd2lkdGg9Jzg0JyBoZWlnaHQ9Jzg0Jy8+PHJlY3QgIHg9JzI1MicgeT0nMzM2JyB3aWR0aD0nODQnIGhlaWdodD0nODQnLz48cmVjdCAgeD0nMCcgeT0nMCcgd2lkdGg9Jzg0JyBoZWlnaHQ9Jzg0Jy8+PHJlY3QgIHg9JzMzNicgeT0nMCcgd2lkdGg9Jzg0JyBoZWlnaHQ9Jzg0Jy8+PHJlY3QgIHg9JzAnIHk9Jzg0JyB3aWR0aD0nODQnIGhlaWdodD0nODQnLz48cmVjdCAgeD0nMzM2JyB5PSc4NCcgd2lkdGg9Jzg0JyBoZWlnaHQ9Jzg0Jy8+PHJlY3QgIHg9JzAnIHk9JzE2OCcgd2lkdGg9Jzg0JyBoZWlnaHQ9Jzg0Jy8+PHJlY3QgIHg9JzMzNicgeT0nMTY4JyB3aWR0aD0nODQnIGhlaWdodD0nODQnLz48cmVjdCAgeD0nMCcgeT0nMjUyJyB3aWR0aD0nODQnIGhlaWdodD0nODQnLz48cmVjdCAgeD0nMzM2JyB5PScyNTInIHdpZHRoPSc4NCcgaGVpZ2h0PSc4NCcvPjwvZz48L3N2Zz4=">
    <div class="tiptext">NameOrIdentifier@saito</div>
  </div>
  <div class="player-slot identicon-empty"></div>
  <div class="player-slot identicon-empty"></div>
  <div class="player-slot identicon-empty"></div>
  <div class="player-slot identicon-empty"></div>
  <div class="player-slot identicon-empty"></div>
  `;
  return `

    <div id="invite-${invite.transaction.sig}" class="arcade-tile i_${idx}" style="background-image: url(/${invite.msg.game}/img/arcade.jpg);">
      <div class="invite-title-wrapper">
        <div class="gameName"><div class="content">${invite.msg.game}</div></div>
        <div class="playerInfo">${playersHtml}</div>
        <div class="gameShortDescription"><div class="content">${makeDescription(app, invite)}</div></div>
        <button class="button invite-tile-join-button">JOIN</button>
      </div>
    </div>
    `;
}
// If the transction message contains a description, use that, otherwise if the module provides a makeInviteDescription function, use that, otherwise fallback to "Game Available"
let makeDescription = (app, invite) => {
  let defaultDescription = "Game";
  let gameModule = app.modules.returnModule(invite.msg.game);
  if(gameModule){
    let moduleDescriptionMaker = gameModule.requestInterface("makeInviteDescription");  
    if(moduleDescriptionMaker){
      defaultDescription = moduleDescriptionMaker.makeDescription(invite.msg);
    }
  }
  
  return invite.msg.description ? invite.msg.description : defaultDescription;
}
