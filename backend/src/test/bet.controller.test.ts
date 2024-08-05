import request from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();
let API_URL = 'http://localhost:6868/api';
const validToken = jwt.sign({}, process.env.JWT_SECRET_KEY || '');
describe('Bet Routes', () => {
    const TestHost = {
        name: 'TestHost',
        newName: 'TestHostNew',
        email: 'qplaytesthost187@gmail.com',
        newEmail: 'qplaytesthost257@gmail.com',
        password: 'TestHost_123',
        newPassword: 'TestHost_1234',
        token: validToken,
        id: null,
        isConfirmed: false,
        resetPasswordToken: null
    };
    const TestEvent = {
        title: 'TestEvent',
        longitude: 10.909,
        latitude: 53.13,
        description: 'Test for description',
        start: '2023-08-12T13:11:57.000+00:00',
        end: '2023-08-26T13:11:57.000+00:00',
        private: true,
        messagePrice: 1,
        songSuggestionPrice: 1,
        
    };
    const TestAuction = {
        end: "2023-09-12T13:11:57.000+00:00",
        startPrice: 5
    }
    const TestBet = {
        songId: '12',
        price: 5,
    }
    let eventId = '';
    let auctionId = '';

  beforeEach(async () => {
    // Create a test event
    const createHost = await request(API_URL)
            .post('/host')
            .send(
                TestHost
            );
      const hostEmail = createHost.body.email;
      const eventRes = await request(API_URL)
        .post(`/event/create/${hostEmail}`)
        .set("Authorization", `Bearer ${validToken}`)
        .send(TestEvent);

    eventId = eventRes.body._id;

    // Create a test auction for the event
    const auctionRes = await request(API_URL)
      .post(`/auction/create/${eventId}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        TestAuction
      });

    auctionId = auctionRes.body._id;
  });

  afterEach(async () => {
    // Delete the test auction
    await request(API_URL)
      .delete(`/auction/${auctionId}`)
      .set('Authorization', `Bearer ${validToken}`);

    // Delete the test event
    await request(API_URL)
      .delete(`/event/${eventId}`);
    await request(API_URL)
            .delete(`/host/${TestHost.email}`)
            .set('Authorization', `Bearer ${TestHost.token}`);
  });
  describe('POST bet/${auctionId}', () => {
    it('should create a bet for an auction', async () => {
      const res = await request(API_URL)
        .post(`/bet/create/${auctionId}`)
        .send(TestBet);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('songId', TestBet.songId);
      expect(res.body).toHaveProperty('price', TestBet.price);
      expect(res.body).toHaveProperty('accepted', false);
    });
  });
});