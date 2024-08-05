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
describe('Event Routes', () => {
    //Test Host
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
    //event is created beforeEach and deleted afterEach test --> no need to separately test create and delete
    describe('POST event/create/:email', () => {
        //POST: /host --> create a new host
        let eventId = "";
        beforeEach(async () => {
            const res = await (0, supertest_1.default)(API_URL)
                .post('/event/create/qplaytesthost3@gmail.com')
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                title: TestEvent.title,
                longitude: TestEvent.longitude,
                latitude: TestEvent.latitude,
                description: TestEvent.description,
                start: TestEvent.start,
                end: TestEvent.end,
                private: TestEvent.private,
                messagePrice: TestEvent.messagePrice,
                songSuggestionPrice: TestEvent.songSuggestionPrice,
            });
            eventId = res.body._id;
            expect(res.statusCode).toBe(201);
            expect(res.body.title).toEqual(TestEvent.title);
            expect(res.body.private).toEqual(true);
            expect(res.body.latitude).toEqual(TestEvent.latitude);
            expect(res.body.messagePrice).toEqual(1);
        });
        afterEach(async () => {
            const res = await (0, supertest_1.default)(API_URL)
                .delete(`/event/${eventId}`)
                .set('Authorization', `Bearer ${validToken}`);
            expect(res.statusCode).toBe(204);
        });
        // PUT: /event/:id --> update the event
        it('should update an event', async () => {
            const updatedEvent = { title: 'UpdatedEvent' };
            const res = await (0, supertest_1.default)(API_URL).put(`/event/${eventId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send(updatedEvent);
            expect(res.statusCode).toBe(200);
            expect(res.body.title).toEqual(updatedEvent.title);
        });
    });
    // GET: /event/data/info/:id --> get event info data
    describe('GET /event/data/info/:id', () => {
        let eventId = "";
        beforeEach(async () => {
            const res = await (0, supertest_1.default)(API_URL).post('/event/create/qplaytesthost3@gmail.com').set('Authorization', `Bearer ${validToken}`)
                .send(TestEvent);
            eventId = res.body._id;
        });
        afterEach(async () => {
            await (0, supertest_1.default)(API_URL).delete(`/event/${eventId}`).set('Authorization', `Bearer ${validToken}`);
        });
        it('should get event info data', async () => {
            const res = await (0, supertest_1.default)(API_URL).get(`/event/data/info/${eventId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.title).toEqual(TestEvent.title);
        });
    });
    // GET: /event/data/vote/:id --> get event vote data
    describe('GET /event/data/vote/:id', () => {
        let eventId = "";
        beforeEach(async () => {
            const res = await (0, supertest_1.default)(API_URL).post('/event/create/qplaytesthost3@gmail.com')
                .set('Authorization', `Bearer ${validToken}`)
                .send(TestEvent);
            eventId = res.body._id;
        });
        afterEach(async () => {
            await (0, supertest_1.default)(API_URL).delete(`/event/${eventId}`)
                .set('Authorization', `Bearer ${validToken}`);
        });
        it('should get event vote data', async () => {
            const res = await (0, supertest_1.default)(API_URL).get(`/event/data/vote/${eventId}`);
            expect(res.statusCode).toBe(200);
        });
    });
    // GET: /event/data/auction/:id --> get event auction data
    describe('GET /event/data/auction/:id', () => {
        let eventId = "";
        beforeEach(async () => {
            const res = await (0, supertest_1.default)(API_URL).post('/event/create/qplaytesthost3@gmail.com')
                .set('Authorization', `Bearer ${validToken}`)
                .send(TestEvent);
            eventId = res.body._id;
        });
        afterEach(async () => {
            await (0, supertest_1.default)(API_URL).delete(`/event/${eventId}`)
                .set('Authorization', `Bearer ${validToken}`);
        });
        it('should get event auction data', async () => {
            const res = await (0, supertest_1.default)(API_URL).get(`/event/data/auction/${eventId}`);
            expect(res.statusCode).toBe(200);
        });
    });
    // GET: /event/data/suggestion/:id --> get event suggestion data
    describe('GET /event/data/suggestion/:id', () => {
        let eventId = "";
        beforeEach(async () => {
            const res = await (0, supertest_1.default)(API_URL).post('/event/create/qplaytesthost3@gmail.com')
                .set('Authorization', `Bearer ${validToken}`)
                .send(TestEvent);
            eventId = res.body._id;
        });
        afterEach(async () => {
            await (0, supertest_1.default)(API_URL).delete(`/event/${eventId}`)
                .set('Authorization', `Bearer ${validToken}`);
        });
        it('should get event suggestion data', async () => {
            const res = await (0, supertest_1.default)(API_URL).
                get(`/event/data/suggestion/${eventId}`).set('Authorization', `Bearer ${validToken}`);
            expect(res.statusCode).toBe(200);
        });
    });
});
