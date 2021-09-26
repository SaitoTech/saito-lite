module.exports = EmailAppspaceTemplate = (app) => {
  return `
  <div class="email-appspace-design">

  <h3>h3 - Module header</h3>

  <button onclick="salert('hey, hey, hey');" class="super">Main*</button>

  <p>Four Column Form*</p>
  <div class="grid-4">
      <div>Title</div>
      <div>This is a row of plain text.</div>
      <div>Password</div>
      <div><input id="password" type="password" value="This is a password field" class="password" /></div>
      <div>Text Input</div>
      <div><input type="text" value="This is a text field."></input></div>
      <div>Drop Down</div>
      <div><select>
        <option>option a</option>
        <option>option b</option>
        <option>option c</option>
      </select></div>
      <div>Date Input</div>
      <div><input type="date" value="2019-10-21"></input></div>
      <div>Range Input</div>
      <div><input type="range" value="8"></input></div>
      <div>Checkboxes</div>
      <div><input type="checkbox" checked></input><input type="checkbox"></input><input type="checkbox"></input><input type="checkbox"></input></div>
      <div>Radio Buttons</div>
      <div><input type="radio" checked></input><input type="radio"></input><input type="radio"></input><input type="radio"></input></div>
      <div>File</div>
      <div><input type="file" name="file" id="file" class="inputfile" /></div>
      <div>Multi File</div>
      <div><input type="file" name="multi-file" id="multi-file" class="inputfile" multiple /></div>
      </div>

  <hr />

  <p>Two Column Form*</p>
  <div class="grid-2">
    <div>Title</div>
    <div>This is a row of plain text.</div>
    <div>Password</div>
    <div><input id="password" type="password" value="This is a password field" class="password" /></div>
    <div>Text Input</div>
    <div><input type="text" value="This is a text field."></input></div>
    <div>Drop Down</div>
    <div><select>
      <option>option a</option>
      <option>option b</option>
      <option>option c</option>
    </select></div>
    <div>Date Input</div>
    <div><input type="date" value="2019-10-21"></input></div>
    <div>Range Input</div>
    <div><input type="range" value="8"></input></div>
    <div>Checkboxes</div>
    <div><input type="checkbox" checked></input><input type="checkbox"></input><input type="checkbox"></input><input type="checkbox"></input></div>
    <div>Radio Buttons</div>
    <div><input type="radio" checked></input><input type="radio"></input><input type="radio"></input><input type="radio"></input></div>
</div>

<hr/>

<div class="tip">
  This is text with a tooltip
  <div class="tiptext">Content of the tool tip. <i>can be html!</i></div>
</div>

<hr/>

<p>Text Area</p>
<textarea>
    Bacon ipsum dolor amet meatloaf ribeye pork loin corned beef strip steak filet mignon shank chicken shankle cupim hamburger bacon kielbasa biltong. Alcatra pork belly ball tip kielbasa t-bone drumstick turducken, boudin porchetta landjaeger. Short ribs chuck frankfurter pork belly spare ribs meatloaf. Pig tri-tip meatloaf picanha, sirloin strip steak shoulder cow porchetta pork chop filet mignon swine burgdoggen bacon.
</textarea>

<button><i class="fas fa-caret-square-right"></i>Standard</button>  

<button class="sub"><i class="fas fa-file-download"></i>Sub Button*</button>

<button class="action"><i class="fas fa-sign-out-alt"></i>Action Button*</button>

<hr />

<p>Monospace*</p>
<p class="monospace">This is monospace output.</p>


<p>Pre</p>
<pre>
    {
        "bf": 1,
        "coinbase": "478016666.66666667",
        "creator": "z1UA26VVMkAKudvDVm9BseGGtq1bfdWz2msp4mMwjRPX",
        "difficulty": 0,
        "id": 2,
        "merkle": "",
        "paysplit": 0.5,
        "powsplit": 0.5,
        "prevbsh": "cb7cdd9633bf67cd3eff12266eb462018f239a78b666059ea3e7088c3f355b04",
        "reclaimed": "0.0",
        "sr": 0,
        "stakepool": "0",
        "treasury": "2390083333.33333333",
        "ts": 1572407380711
        }
</pre>

<p>Fieldset</p>
<fieldset>
    <h1>h1 Heading</h1>
    <h2>h2 Heading</h2>
    <h3>h3 Heading - Module and Page Title</h3>
    <h4>h4 Sub Heading</h4>
    <h5>h4 Sub Heading</h5>
    <h6>h4 Sub Heading</h4>    
    <p>Bacon ipsum dolor amet meatloaf ribeye pork loin corned beef strip steak filet mignon shank chicken shankle cupim hamburger bacon kielbasa biltong. Alcatra pork belly ball tip kielbasa t-bone drumstick turducken, boudin porchetta landjaeger. Short ribs chuck frankfurter pork belly spare ribs meatloaf. Pig tri-tip meatloaf picanha, sirloin strip steak shoulder cow porchetta pork chop filet mignon swine burgdoggen bacon.

    </p>    
</fieldset>

<hr>

<button onclick="salert('This is a Saito native Alert');" >Alert</button>
<button onclick="sconfirm('This is a Saito native Confirm');" >Confirm</button>
  `;
}
