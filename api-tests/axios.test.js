const axios = require('axios');
const config = require('../utils/config.json');


const baseUrl = config.baseUrl;
const { username, password } = config.credentials;
const {firstname, lastname, totalprice, depositpaid, bookingdates, additionalneeds} = config.createBookingBody;
const {firstnameNew, lastnameNew, totalpriceNew, depositpaidNew, bookingdatesNew, additionalneedsNew} = config.updateBookingBody;

let authToken;
let createdBookingId;

beforeAll(async () => {
    // Authorization step to get the token
        const response = await axios.post(`${baseUrl}/auth`, {
        username: username,
        password: password
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('token');
    authToken = response.data.token;
});

    test('Create Booking', async () => {
        const response = await axios.post(`${baseUrl}/booking`, {
            firstname : firstname,
            lastname : lastname,
            totalprice : totalprice,
            depositpaid : depositpaid,
            bookingdates : {
                checkin : bookingdates.checkin,
                checkout : bookingdates.checkout
                },
            additionalneeds : additionalneeds,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('bookingid');
        createdBookingId = response.data.bookingid
    });

    test('Get Booking by ID', async () => {
        const response = await axios.get(`${baseUrl}/booking/${createdBookingId}`, {
            headers: {
                'Accept': 'application/json'
        }
    });
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('firstname')
    });

    test('Delete Booking', async () => {
        const response = await axios.delete(`${baseUrl}/booking/${createdBookingId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${authToken}`
            }
        });
        expect(response.status).toBe(201);
    });

    test('Get All Bookings', async () => {
        const response = await axios.get(`${baseUrl}/booking`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
    });

    // test('Update Deleted Booking', async () => {

    //     const response = await axios.put(`${baseUrl}/booking/${createdBookingId}`, {
    //         firstname: firstnameNew,
    //         lastname: lastnameNew,
    //         totalprice: totalpriceNew,
    //         depositpaid: depositpaidNew,
    //         bookingdates: {
    //             checkin: bookingdatesNew.checkin,
    //             checkout: bookingdatesNew.checkout
    //         },
    //         additionalneeds: additionalneedsNew,
    //     }, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/json',
    //             'Cookie': `token=${authToken}`
    //         }
    //     });
    //     expect(response.status).toBe(405)

    // });

    test('Update Existing Booking', async () => {

        const responseNew = await axios.post(`${baseUrl}/booking`, {
            firstname : firstname,
            lastname : lastname,
            totalprice : totalprice,
            depositpaid : depositpaid,
            bookingdates : {
                checkin : bookingdates.checkin,
                checkout : bookingdates.checkout
                },
            additionalneeds : additionalneeds,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        createdBookingIdNew = responseNew.data.bookingid;
        const response = await axios.put(`${baseUrl}/booking/${createdBookingIdNew}`, {
            firstname : firstnameNew,
            lastname : lastnameNew,
            totalprice : totalpriceNew,
            depositpaid : depositpaidNew,
            bookingdates : {
                checkin : bookingdatesNew.checkin,
                checkout : bookingdatesNew.checkout
                },
            additionalneeds : additionalneedsNew,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${authToken}`
            }
        });
        expect(response.status).toBe(200);
        expect(response.data.firstname).toBe(firstnameNew);
    });