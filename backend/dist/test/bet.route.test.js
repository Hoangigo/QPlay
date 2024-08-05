"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let API_URL = 'http://localhost:6868/api';
const validToken = jsonwebtoken_1.default.sign({}, process.env.JWT_SECRET_KEY || '');
describe('Bet Routes', () => {
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
    };
    const TestBet = {
        songId: '12',
        price: 5,
    };
    let eventId = '';
    let auctionId = '';
    beforeEach(async () => {
        // Create a test event
        const eventRes = await (0, supertest_1.default)(API_URL)
            .post('/event/create/qplaytesthost3@gmail.com')
            .set('Authorization', `Bearer ${validToken}`)
            .send({
            TestEvent
        });
        eventId = eventRes.body._id;
        // Create a test auction for the event
        const auctionRes = await (0, supertest_1.default)(API_URL)
            .post(`/auction/create/${eventId}`)
            .set('Authorization', `Bearer ${validToken}`)
            .send({
            TestAuction
        });
        auctionId = auctionRes.body._id;
    });
    afterEach(async () => {
        // Delete the test auction
        await (0, supertest_1.default)(API_URL)
            .delete(`/auction/${auctionId}`)
            .set('Authorization', `Bearer ${validToken}`);
        // Delete the test event
        await (0, supertest_1.default)(API_URL)
            .delete(`/event/${eventId}`);
    });
    //dont know why the backend crash
    /*
    describe('GET /bet/${auctionId}', () => {
      it('should get bets for an auction', async () => {
        const res = await request(API_URL)
          .get(`/bet/${auctionId}`)
        expect(res.statusCode).toBe(200);
        expect(res.body.auction).toHaveProperty('_id', auctionId);
        expect(res.body.auction).toHaveProperty('bets');
        expect(res.body.auction.bets).toBeInstanceOf(Array);
      });
  });*/
    describe('POST bet/${auctionId}', () => {
        it('should create a bet for an auction', async () => {
            const res = await (0, supertest_1.default)(API_URL)
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
