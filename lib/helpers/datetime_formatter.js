module.exports = datetimeFormatter = (timestamp) => {
  let datetime = new Date(timestamp);
  let hours = datetime.getHours();
  let minutes = datetime.getMinutes();
  minutes = minutes.toString().length == 1 ? `0${minutes***REMOVED***` : `${minutes***REMOVED***`;
  return { hours, minutes ***REMOVED***
***REMOVED***