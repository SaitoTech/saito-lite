module.exports = HospitalProfileTemplate = () => {
  return `

    <h2>Make Appointment</h2>

      <div class="label_name">FIRST NAME: </div>
      <div class="row">
        <div class="col-100">
          <input type="text" name="name_first" placeholder="First Name" />
        </div>
      </div>


      <div class="label_name">FAMILY NAME: </div>
      <div class="row">
        <div class="col-100">
          <input type="text" name="name_family" placeholder="Last Name" />
        </div>
      </div>


      <div class="label">DNI #: </div>
      <div class="row">
        <div class="col-75">
            <input type="text" name="input_id" placeholder="DNI Number"/>
        </div>
        <div class="col-25">
        </div>
      </div>


      <div class="label">D.O.B: </div>
      <div class="row">
          <div class="col-20">
            <select name="dob_year">
                <option value="1950" >1950</option>
                <option value="1951" >1951</option>
                <option value="1952" >1952</option>
                <option value="1953" >1953</option>
                <option value="1954" >1954</option>
                <option value="1955" >1955</option>
                <option value="1956" >1956</option>
                <option value="1957" >1957</option>
                <option value="1958" >1958</option>
                <option value="1959" >1959</option>
            </select>
          </div>
          <div class="col-2">
          </div>
          <div class="col-15">
            <select name="dob_month">
                <option value="01" >01</option>
                <option value="02" >02</option>
                <option value="03" >03</option>
                <option value="04" >04</option>
                <option value="05" >05</option>
                <option value="06" >06</option>
                <option value="07" >07</option>
                <option value="08" >08</option>
                <option value="09" >09</option>
                <option value="10" >10</option>
                <option value="11" >11</option>
                <option value="12" >12</option>
            </select>
          </div>
          <div class="col-2">
          </div>
          <div class="col-15">
            <select name="dob_day">
                <option value="01" >01</option>
                <option value="02" >02</option>
                <option value="03" >03</option>
                <option value="04" >04</option>
                <option value="05" >05</option>
                <option value="06" >06</option>
                <option value="07" >07</option>
                <option value="08" >08</option>
                <option value="09" >09</option>
                <option value="10" >10</option>
                <option value="11" >11</option>
                <option value="12" >12</option>
                <option value="13" >13</option>
                <option value="14" >14</option>
                <option value="15" >15</option>
                <option value="16" >16</option>
                <option value="17" >17</option>
                <option value="18" >18</option>
                <option value="19" >19</option>
                <option value="20" >20</option>
                <option value="21" >21</option>
                <option value="22" >22</option>
                <option value="23" >23</option>
                <option value="24" >24</option>
                <option value="25" >25</option>
                <option value="26" >26</option>
                <option value="27" >27</option>
                <option value="28" >28</option>
                <option value="29" >29</option>
                <option value="30" >30</option>
                <option value="31" >31</option>
            </select>
          </div>
        <div class="col-46">
        </div>
      </div>


      <div class="label_phone">PHONE: </div>
        <div class="input_phone row">
          <div class="col-15">
             <select name="country_code" id="country_code" class="country_code">
               <option data-countryCode="PE" value="51" selected>(+51)</option>
             </select>
          </div>
          <div class="col-2">
          </div>
          <div class="col-58">
            <input type="number" name="phone_number" />
          </div>
          <div class="col-25">
          </div>
        </div>
      </div>

      <div class="row" style="margin-top:20px;">
        <div class="col-25"></div>
        <div class="col-50">
          <button class="button" id="confirm-profile-accurate-btn">Confirm</button>
        </div>
        <div class="col-25"></div>
      </div>

<style>
body {
    font-family: arial, helvetica, sans-serif;
    font-size: 13px;
    padding:0px;
    margin:0px;
}

h1 {
    margin: 0em;
}

.details_textarea {
  border: 1px solid black;
  padding:2px;
  width: 100%;
  height: 200px;

}

.row {
    display: -ms-flexbox; /* IE10 */
    display: flex;
    -ms-flex-wrap: wrap; /* IE10 */
    flex-wrap: wrap;
}

.col-2 {
    -ms-flex: 2%; /* IE10 */
    flex: 2%;
}

.col-5 {
    -ms-flex: 5%; /* IE10 */
    flex: 5%;
}

.col-10 {
    -ms-flex: 10%; /* IE10 */
    flex: 10%;
}

.col-15 {
    -ms-flex: 15%; /* IE10 */
    flex: 15%;
}

.col-20 {
    -ms-flex: 20%; /* IE10 */
    flex: 20%;
}

.col-25 {
    -ms-flex: 25%; /* IE10 */
    flex: 25%;
}

.col-28 {
    -ms-flex: 28%; /* IE10 */
    flex: 28%;
}

.col-33 {
    -ms-flex: 33%; /* IE10 */
    flex: 33%;
}

.col-40 {
    -ms-flex: 40%; /* IE10 */
    flex: 40%;
}

.col-46 {
    -ms-flex: 46%; /* IE10 */
    flex: 46%;
}

.col-50 {
    -ms-flex: 50%; /* IE10 */
    flex: 50%;
}

.col-58 {
    -ms-flex: 58%; /* IE10 */
    flex: 58%;
}

.col-60 {
    -ms-flex: 60%; /* IE10 */
    flex: 60%;
}

.col-75 {
    -ms-flex: 75%; /* IE10 */
    flex: 75%;
}

.col-80 {
    -ms-flex: 80%; /* IE10 */
    flex: 80%;
}

.col-100 {
    -ms-flex: 100%; /* IE10 */
    flex: 100%;
}

.splash {

}

.splash_image_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 1em;
}

.splash_image {
    width: 30%;
    height: auto;
}

.splash_buttons_container {
    text-align:center;
    padding: 1em;
}

.container {
    padding: 1rem;
    display: grid;
    grid-gap: 0.5em;
}

.appointment {
    display: grid;
    grid-gap: 0.75em;
    margin: auto;
    /* max-width: 30vw; */
    width: 50vw;
}

select {
    height: 2.5em;
    width: 100%;
    border: 1px solid lightgrey;
}


.input_dob {
    display: flex;
}

.label {
    margin-bottom: 0.5em;
}


input[type=text], input[type=number] {
    width: 100%;
    font-size: 1em;
    padding: 0.3em;
    border: 1px solid lightgrey;
    border-radius: 3px;
}

textarea {
    width: 100%;
    height: 10vw;
}


.button {
    border: none;
    background: #404040;
    color: #ffffff !important;
    font-weight: 100;
    padding: 20px;
    text-transform: uppercase;
    border-radius: 6px;
    transition: all 0.3s ease 0s;
}

#confirm {
    width: 100%;
}

</style>

  `;
}
