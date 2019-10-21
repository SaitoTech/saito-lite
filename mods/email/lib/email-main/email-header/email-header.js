const EmailInboxHeader = require('./email-inbox-header');
const EmailDetailHeader = require('./email-detail-header');
const EmailFormHeader = require('./email-form-header');

module.exports = EmailHeader = {

  render(app, data) {

    //
    // normal "on-load" header
    //
    if (data.parentmod.header == 0) {
      EmailInboxHeader.render(app, data);
***REMOVED***

    //
    // application + email header
    //
    if (data.parentmod.header == 1) {
      EmailDetailHeader.render(app, data);
***REMOVED***

    //
    // write email header
    //
    if (data.parentmod.header == 2) {
      EmailFormHeader(app, data);
***REMOVED***

  ***REMOVED***,

  attachEvents(app, data) {

    if (data.parentmod.header == 0) {
      EmailInboxHeader.attachEvents(app, data);
      return;
***REMOVED***

    if (data.parentmod.header == 1) {
      EmailDetailHeader.attachEvents(app, data);
      return;
***REMOVED***

    if (data.parentmod.header == 2) {
      EmailFormHeader.attachEvents(app, data);
      return;
***REMOVED***

  ***REMOVED***,

***REMOVED***
