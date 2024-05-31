const fs = require('fs');
const path = require('path');
const { createBooking } = require('./randomGenerator.js');

// Path to the JSON file
const configPath = path.join(__dirname, 'config.json');

// Read the JSON file
fs.readFile(configPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading config.json:', err);
    return;
  }

  let config;
  try {
    config = JSON.parse(data);
  } catch (parseErr) {
    console.error('Error parsing config.json:', parseErr);
    return;
  }

  // Generate random booking data
  const booking = createBooking();

  // Add the random booking data to the config object
  config.createBookingBody = booking;

  // Write the updated config object back to the JSON file
  fs.writeFile(configPath, JSON.stringify(config, null, 2), (writeErr) => {
    if (writeErr) {
      console.error('Error writing to config.json:', writeErr);
    } else {
      console.log('Updated config.json with random booking:', booking);
    }
  });
});