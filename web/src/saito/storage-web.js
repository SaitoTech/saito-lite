import axios from 'axios';
import Storage from '../../../lib/saito/storage';

export default class StorageLite extends Storage{
  constructor(app) {
    super(app);
  }

  loadOptions() {
    if (typeof(Storage) !== "undefined") {
      let data = localStorage.getItem("options");
      if (data)  {
        this.app.options = JSON.parse(data);
      }
    }
  }

  saveOptions() {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem("options", JSON.stringify(this.app.options));
    }
  }

  resetOptions() {
    return axios.get(`/options`)
      .then(response => {
        this.app.options = response.data;
        this.saveOptions();
      })
      .catch(error => {
        console.error(error);
      });
  }
}
