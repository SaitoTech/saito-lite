module.exports = HospitalProfileTemplate = () => {
  return `
  <h3>Make Appointment</h3>
  <div class="grid-2">
      <div>First Name:</div>
      <div>
          <input type="text" name="name_first" placeholder="First Name" />
      </div>
      <div>Family Name:</div>
      <div>
          <input type="text" name="name_family" placeholder="Family Name" />
      </div>
      <div>DNI #: </div>
      <div>
          <input type="text" name="input_id" placeholder="DNI Number" />
      </div>
      <div>Date of Birth:</div>
      <div>
          <input type="date" value="1985-01-01">
      </div>
  
      <div>Phone:</div>
      <div>
          <select name=" country_code " id="country_code " class="country_code ">
              <option data-countryCode="PE " value="51 " selected>(+51)</option>
          </select>
          <input type="number" name="phone_number" />
      </div>
  </div>
  <button id="confirm-profile-accurate-btn ">Confirm</button>
  
  <div style="display:none; " class="row ">
      <div class="col-20 ">
          <select name="dob_year ">
              <option value="1950 ">1950</option>
              <option value="1951 ">1951</option>
              <option value="1952 ">1952</option>
              <option value="1953 ">1953</option>
              <option value="1954 ">1954</option>
              <option value="1955 ">1955</option>
              <option value="1956 ">1956</option>
              <option value="1957 ">1957</option>
              <option value="1958 ">1958</option>
              <option value="1959 ">1959</option>
          </select>
      </div>
      <div class="col-2 ">
      </div>
      <div class="col-15 ">
          <select name="dob_month ">
              <option value="01 ">01</option>
              <option value="02 ">02</option>
              <option value="03 ">03</option>
              <option value="04 ">04</option>
              <option value="05 ">05</option>
              <option value="06 ">06</option>
              <option value="07 ">07</option>
              <option value="08 ">08</option>
              <option value="09 ">09</option>
              <option value="10 ">10</option>
              <option value="11 ">11</option>
              <option value="12 ">12</option>
          </select>
      </div>
      <div class="col-2 ">
      </div>
      <div class="col-15 ">
          <select name="dob_day ">
              <option value="01 ">01</option>
              <option value="02 ">02</option>
              <option value="03 ">03</option>
              <option value="04 ">04</option>
              <option value="05 ">05</option>
              <option value="06 ">06</option>
              <option value="07 ">07</option>
              <option value="08 ">08</option>
              <option value="09 ">09</option>
              <option value="10 ">10</option>
              <option value="11 ">11</option>
              <option value="12 ">12</option>
              <option value="13 ">13</option>
              <option value="14 ">14</option>
              <option value="15 ">15</option>
              <option value="16 ">16</option>
              <option value="17 ">17</option>
              <option value="18 ">18</option>
              <option value="19 ">19</option>
              <option value="20 ">20</option>
              <option value="21 ">21</option>
              <option value="22 ">22</option>
              <option value="23 ">23</option>
              <option value="24 ">24</option>
              <option value="25 ">25</option>
              <option value="26 ">26</option>
              <option value="27 ">27</option>
              <option value="28 ">28</option>
              <option value="29 ">29</option>
              <option value="30 ">30</option>
              <option value="31 ">31</option>
          </select>
      </div>
  </div>
    `;
}
