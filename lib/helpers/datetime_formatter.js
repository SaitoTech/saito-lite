module.exports = datetimeFormatter = (timestamp) => {
  let datetime = new Date(timestamp);
  let years = datetime.getFullYear();
  let months = datetime.getMonth(); // MM = 0-11
  months++; // human readable
  let days = datetime.getDate();
  let hours = datetime.getHours();
  let minutes = datetime.getMinutes();
  minutes = minutes.toString().length == 1 ? `0${minutes}` : `${minutes}`;
  return { years, months, days, hours, minutes }
}