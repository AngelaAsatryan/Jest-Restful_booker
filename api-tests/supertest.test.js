const request = require('supertest');
const config = require('../utils/config.json');

const baseUrl = config.baseUrl; 
const { username, password } = config.credentials;
const { firstname, lastname, totalprice, depositpaid, bookingdates, additionalneeds } = config.createBookingBody;
const { firstnameNew, lastnameNew, totalpriceNew, depositpaidNew, bookingdatesNew, additionalneedsNew } = config.updateBookingBody;

let authToken;
let createdBookingId;

beforeAll(async () => {
    // Authorization step to get the token
    const response = await request(baseUrl)
        .post('/auth')
        .send({
            username: username,
            password: password
        })
        .set('Content-Type', 'application/json');
        
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    authToken = response.body.token;
});

test('Create Booking', async () => {
    const response = await request(baseUrl)
        .post('/booking')
        .send({
            firstname: firstname,
            lastname: lastname,
            totalprice: totalprice,
            depositpaid: depositpaid,
            bookingdates: {
                checkin: bookingdates.checkin,
                checkout: bookingdates.checkout
            },
            additionalneeds: additionalneeds,
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
        
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('bookingid');
    createdBookingId = response.body.bookingid;
});

test('Get Booking by ID', async () => {
    const response = await request(baseUrl)
        .get(`/booking/${createdBookingId}`)
        .set('Accept', 'application/json');
        
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('firstname');
});

test('Delete Booking', async () => {
    const response = await request(baseUrl)
        .delete(`/booking/${createdBookingId}`)
        .set('Content-Type', 'application/json')
        .set('Cookie', `token=${authToken}`);
        
    expect(response.status).toBe(201);
});

test('Get All Bookings', async () => {
    const response = await request(baseUrl)
        .get('/booking');
        
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
});

test('Update Existing Booking', async () => {
    // Create another booking to update
    const responseNew = await request(baseUrl)
        .post('/booking')
        .send({
            firstname: firstname,
            lastname: lastname,
            totalprice: totalprice,
            depositpaid: depositpaid,
            bookingdates: {
                checkin: bookingdates.checkin,
                checkout: bookingdates.checkout
            },
            additionalneeds: additionalneeds,
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
        
    const createdBookingIdNew = responseNew.body.bookingid;

    const response = await request(baseUrl)
        .put(`/booking/${createdBookingIdNew}`)
        .send({
            firstname: firstnameNew,
            lastname: lastnameNew,
            totalprice: totalpriceNew,
            depositpaid: depositpaidNew,
            bookingdates: {
                checkin: bookingdatesNew.checkin,
                checkout: bookingdatesNew.checkout
            },
            additionalneeds: additionalneedsNew,
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Cookie', `token=${authToken}`);
        
    expect(response.status).toBe(200);
    expect(response.body.firstname).toBe(firstnameNew);
});
test('Get all bookings', async () => {
    const response = await request(baseUrl)
        .get(`/booking/`)
        .set('Accept', 'application/json');
        
    expect(response.status).toBe(400);
    expect(response.body[0]).toHaveProperty('bookingid');
});