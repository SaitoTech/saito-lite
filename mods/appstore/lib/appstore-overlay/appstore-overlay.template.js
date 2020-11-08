module.exports = AppStoreAppspaceTemplate = () => {

  return `
  
<div class="appstore-overlay-container">

  <div class="appstore-header-featured grid-2">
    <div>Install Applications:</div>
    <div class="searchbox">
        <input type="text" placeholder="search for apps..." id="appstore-search-box">
    </div>
  </div>

  <div class="appstore-overlay-grid">

    <div class="appstore-overlay-app">
      <div class="appstore-overlay-app-image" style="background-image: url('/twilight/img/arcade.jpg')"></div>
      <div class="appstore-overlay-app-details">
        <div class="appstore-overlay-app-title">Twilight Struggle</div>
        <div class="appstore-overlay-app-type">Financial, Strategy</div>
      </div>
    </div>

    <div class="appstore-overlay-app">
      <div class="appstore-overlay-app-image" style="background-image: url('/twilight/img/arcade.jpg')"></div>
      <div class="appstore-overlay-app-details">
        <div class="appstore-overlay-app-title">Twilight Struggle</div>
        <div class="appstore-overlay-app-type">Financial, Strategy</div>
      </div>
    </div>

    <div class="appstore-overlay-app">
      <div class="appstore-overlay-app-image" style="background-image: url('/twilight/img/arcade.jpg')"></div>
      <div class="appstore-overlay-app-details">
        <div class="appstore-overlay-app-title">Twilight Struggle</div>
        <div class="appstore-overlay-app-type">Financial, Strategy</div>
      </div>
    </div>

    <div class="appstore-overlay-app">
      <div class="appstore-overlay-app-image" style="background-image: url('/twilight/img/arcade.jpg')"></div>
      <div class="appstore-overlay-app-details">
        <div class="appstore-overlay-app-title">Twilight Struggle</div>
        <div class="appstore-overlay-app-type">Financial, Strategy</div>
      </div>
    </div>

    <div class="appstore-overlay-app">
      <div class="appstore-overlay-app-image" style="background-image: url('/twilight/img/arcade.jpg')"></div>
      <div class="appstore-overlay-app-details">
        <div class="appstore-overlay-app-title">Twilight Struggle</div>
        <div class="appstore-overlay-app-type">Financial, Strategy</div>
      </div>
    </div>

    <div class="appstore-overlay-app">
      <div class="appstore-overlay-app-image" style="background-image: url('/twilight/img/arcade.jpg')"></div>
      <div class="appstore-overlay-app-details">
        <div class="appstore-overlay-app-title">Twilight Struggle</div>
        <div class="appstore-overlay-app-type">Financial, Strategy</div>
      </div>
    </div>

    <div class="appstore-overlay-app">
      <div class="appstore-overlay-app-image" style="background-image: url('/twilight/img/arcade.jpg')"></div>
      <div class="appstore-overlay-app-details">
        <div class="appstore-overlay-app-title">Twilight Struggle</div>
        <div class="appstore-overlay-app-type">Financial, Strategy</div>
      </div>
    </div>

    <div class="appstore-overlay-app">
      <div class="appstore-overlay-app-image" style="background-image: url('/twilight/img/arcade.jpg')"></div>
      <div class="appstore-overlay-app-details">
        <div class="appstore-overlay-app-title">Twilight Struggle</div>
        <div class="appstore-overlay-app-type">Financial, Strategy</div>
      </div>
    </div>

    <div class="appstore-overlay-app">
      <div class="appstore-overlay-app-image" style="background-image: url('/twilight/img/arcade.jpg')"></div>
      <div class="appstore-overlay-app-details">
        <div class="appstore-overlay-app-title">Twilight Struggle</div>
        <div class="appstore-overlay-app-type">Financial, Strategy</div>
      </div>
    </div>

    <div class="appstore-overlay-app">
      <div class="appstore-overlay-app-image" style="background-image: url('/twilight/img/arcade.jpg')"></div>
      <div class="appstore-overlay-app-details">
        <div class="appstore-overlay-app-title">Twilight Struggle</div>
        <div class="appstore-overlay-app-type">Financial, Strategy</div>
      </div>
    </div>

    <div class="appstore-overlay-app">
      <div class="appstore-overlay-app-image" style="background-image: url('/twilight/img/arcade.jpg')"></div>
      <div class="appstore-overlay-app-details">
        <div class="appstore-overlay-app-title">Twilight Struggle</div>
        <div class="appstore-overlay-app-type">Financial, Strategy</div>
      </div>
    </div>

    <div class="appstore-overlay-app">
      <div class="appstore-overlay-app-image" style="background-image: url('/twilight/img/arcade.jpg')"></div>
      <div class="appstore-overlay-app-details">
        <div class="appstore-overlay-app-title">Twilight Struggle</div>
        <div class="appstore-overlay-app-type">Financial, Strategy</div>
      </div>
    </div>

  </div>


  <fieldset class="appstore-overlay-developers">
    <p>
      Developer? Code your first Saito Application in five minutes. Click here to learn how.
    </p>
  </fieldset>

</div>
<style type="text/css">

.appstore-overlay-container {
  background-color: whitesmoke;
  width: 80vw;
  height: 80vh;
  padding: 20px;
  overflow-y: scroll;
}
.appstore-overlay-grid {
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 1fr 1fr;
}

.appstore-overlay-app {
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 2fr 3fr;
  cursor: pointer;
  border: 1px solid var(--saito-red);
  font-size:20px;
  padding: 10px;
  min-height: 100px;
}

.appstore-overlay-app-image {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

.appstore-overlay-app-details {
  font-size: 1em;
}
.appstore-overlay-app-title {
  font-weight: bold;
}

.appstore-overlay-app-type {
  font-size: 0.9em;
}

</style>

  `;
}
