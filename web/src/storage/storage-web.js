import axios from 'axios';
import Storage from '../../../lib/saito/storage';

export default class StorageLite extends Storage{
  constructor(app) {
    super(app);
  ***REMOVED***

  loadOptions() {
    if (typeof(Storage) !== "undefined") {
      let data = localStorage.getItem("options");
      if (data != "null")  {
        this.app.options = JSON.parse(data);
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  saveOptions() {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem("options", JSON.stringify(this.app.options));
***REMOVED***
  ***REMOVED***

  resetOptions() {
    return axios.get(`/options`)
      .then(response => {
        this.app.options = response.data;
        this.saveOptions();
  ***REMOVED***)
      .catch(error => {
        console.error(error);
  ***REMOVED***);
  ***REMOVED***
***REMOVED***
