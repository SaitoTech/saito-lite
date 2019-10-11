export const ArcadeTemplate = () => {
    return `
       <div class="arcade container">
            <h3>Active Games</h2>
            <div class="games-table">
                <div class="games-row">
                    <i class="icon-med fas fa-radiation"></i>
                    <div class="games-content">
                        <h3>Twilight Struggle</h3>
                        <p class="games-author">From: david@saito</p>
                    </div>
                  <button class="games-button accept-button">ACCEPT</button>
                </div>

                <div class="games-row">
                  <i class="icon-med fas fa-file-word"></i>
                  <div class="games-content">
                      <h3>Wordblocks</h3>
                      <p class="games-author">From: richard@saito</p>
                  </div>
                  <button class="games-button accept-button">ACCEPT</button>
               </div>

              <div class="games-row">
                  <i class="icon-med fas fa-chess"></i>
                  <div class="games-content">
                      <h3>Chess</h3>
                      <p class="games-author">From: adrian@saito</p>
                  </div>
                  <button class="games-button accept-button">ACCEPT</button>
              </div>

              <div class="games-row">
                  <i class="icon-med fas fa-radiation"></i>
                  <div class="games-content">
                      <h3>Twilight Struggle</h3>
                      <p class="games-author">From: Me</p>
                  </div>
                  <button class="games-button delete-button">DELETE</button>
              </div>

           </div>
        </div>
      </div>
      <button id="arcade" class="create-button"><i class="fas fa-plus"></i></button>
    `;
***REMOVED***
