function formatDate(date) {
  date = new Date(date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  //   const hours = String(date.getHours()).padStart(2, "0");
  //   const minutes = String(date.getMinutes()).padStart(2, "0");
  //   const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const now = new Date();
module.exports = [
  {
    traveller_id: 1,
    parking_id: 3,
    booking_start: formatDate(now),
    booking_end: formatDate(new Date(now).getTime() + 60 * 60 * 24 * 1000),
    price: 4.1,
  },
];
