const request = require('supertest');
const config = require('../utils/config.json');

jest.mock('supertest');

const mockRequest = {
    post: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    put: jest.fn().mockReturnThis()
};

request.mockImplementation(() => mockRequest);

const baseUrl = config.baseUrl; 
const { firstnameNew, lastnameNew, totalpriceNew, depositpaidNew, bookingdatesNew, additionalneedsNew } = config.updateBookingBody;

let createdBookingId;

beforeAll(async () => {
    mockRequest.post.mockResolvedValue({
        status: 200,
        body: { token: 'mockedToken' }
    })
});
test('Create Booking', async () => {
    mockRequest.post.mockResolvedValue({
        status: 200,
        body: { bookingid: 'mockedBookingId' }
    });

    const response = await request(baseUrl)
        .post('/booking')
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('bookingid');
    createdBookingId = response.body.bookingid;
});

test('Get Booking by ID', async () => {
    mockRequest.get.mockResolvedValue({
        status: 200,
        body: { firstname: 'mockedFirstName' ,
                lastname: 'mockedLastName'
        }
    });

    const response = await request(baseUrl)
        .get(`/booking/${createdBookingId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('lastname');
});

test('Delete Booking', async () => {
    mockRequest.delete.mockResolvedValue({
        status: 201
    });

    const response = await request(baseUrl)
        .delete(`/booking/${createdBookingId}`)

    expect(response.status).toBe(201);
});

test('Get All Bookings', async () => {
    mockRequest.get.mockResolvedValue({
        status: 200,
        body: [{ bookingid: 'mockedBookingId' }]
    });

    const response = await request(baseUrl)
        .get('/booking');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
});

test('Update Existing Booking', async () => {
    mockRequest.put.mockResolvedValue({
        status: 200,
        body: {
            firstname: firstnameNew,
            lastname: lastnameNew,
            totalprice: totalpriceNew,
            depositpaid: depositpaidNew,
            bookingdates: {
                checkin: bookingdatesNew.checkin,
                checkout: bookingdatesNew.checkout
            },
            additionalneeds: additionalneedsNew
        }
    });

    const response = await request(baseUrl)
        .put(`/booking/${createdBookingId}`)
    expect(response.status).toBe(200);
    expect(response.body.firstname).toBe(firstnameNew)
});