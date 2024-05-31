const date = require('date-and-time');

const randomiseDate = function (start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomiseNumber = function (from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
};

const randomiseFirstName = function () {
  const names = ["Mark", "Mary", "Sally", "Jim", "Eric", "Susan"];
  return names[randomiseNumber(0, names.length - 1)];
};

const randomiseLastName = function () {
  const surnames = ["Jones", "Wilson", "Jackson", "Brown", "Smith", "Ericsson"];
  return surnames[randomiseNumber(0, surnames.length - 1)];
};

const randomiseBool = function () {
  const bool = [true, false];
  return bool[randomiseNumber(0, bool.length - 1)];
};

exports.createBooking = function() {
  const checkInDate = randomiseDate(new Date(2015, 1, 1), new Date());
  const latestDate = new Date();
  latestDate.setDate(latestDate.getDate() + 3);

  const booking = {
    firstname: randomiseFirstName(),
    lastname: randomiseLastName(),
    totalprice: randomiseNumber(100, 1000),
    depositpaid: randomiseBool(),
    bookingdates: {
      checkin: date.format(new Date(checkInDate.setHours(15, 0, 0, 0)), 'YYYY-MM-DD'),
      checkout: date.format(new Date(randomiseDate(checkInDate, latestDate).setHours(12, 0, 0, 0)), 'YYYY-MM-DD')
    }
  };

  if(randomiseBool()) {
    booking.additionalneeds = "Breakfast";
  }

  return booking;
};