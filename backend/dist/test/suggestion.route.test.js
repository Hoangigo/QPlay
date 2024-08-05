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
describe('Suggestion Routes', () => {
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
    const TestSuggestion = {
        songId: "1",
        message: "happy birthday",
        boosted: false
    };
    describe('GET /suggestion/:id', () => {
        let suggestionId = '';
        let eventId = '';
        beforeEach(async () => {
            const createEventRes = await (0, supertest_1.default)(API_URL)
                .post('/event/create/qplaytesthost3@gmail.com')
                .set('Authorization', `Bearer ${validToken}`)
                .send(TestEvent);
            eventId = createEventRes.body._id;
            // Create a suggestion for the event
            const createSuggestionRes = await (0, supertest_1.default)(API_URL)
                .post(`/suggestion/create/${eventId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send(TestSuggestion);
            suggestionId = createSuggestionRes.body._id;
        });
        afterEach(async () => {
            // Clean up the suggestion
            await (0, supertest_1.default)(API_URL).delete(`/event/${eventId}`)
                .set('Authorization', `Bearer ${validToken}`);
            await (0, supertest_1.default)(API_URL).delete(`/suggestion/${suggestionId}`)
                .set('Authorization', `Bearer ${validToken}`);
        });
        it('should get suggestions for an event', async () => {
            const res = await (0, supertest_1.default)(API_URL).get(`/event/data/suggestion/${eventId}`).set('Authorization', `Bearer ${validToken}`);
            expect(res.statusCode).toBe(200);
            const suggestions = res.body.suggestions;
            expect(suggestions[0].songId).toEqual(TestSuggestion.songId);
            expect(suggestions[0]._id).toEqual(suggestionId);
            expect(suggestions[0].message).toEqual(TestSuggestion.message);
        });
    });
    describe('POST /suggestion/create/:eventId', () => {
        let eventId = '';
        let suggestionId = '';
        beforeEach(async () => {
            const createEventRes = await (0, supertest_1.default)(API_URL)
                .post('/event/create/qplaytesthost3@gmail.com')
                .set('Authorization', `Bearer ${validToken}`)
                .send(TestEvent);
            eventId = createEventRes.body._id;
        });
        afterEach(async () => {
            // Clean up the suggestion
            await (0, supertest_1.default)(API_URL).delete(`/event/${eventId}`)
                .set('Authorization', `Bearer ${validToken}`);
            await (0, supertest_1.default)(API_URL).delete(`/suggestion/${suggestionId}`)
                .set('Authorization', `Bearer ${validToken}`);
        });
        it('should create a suggestion for an event', async () => {
            const res = await (0, supertest_1.default)(API_URL)
                .post(`/suggestion/create/${eventId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send(TestSuggestion);
            suggestionId = res.body._id;
            expect(res.statusCode).toBe(201);
        });
    });
    describe('PUT /suggestion/:id', () => {
        let suggestionId = '';
        let eventId = '';
        beforeEach(async () => {
            const createEventRes = await (0, supertest_1.default)(API_URL)
                .post('/event/create/qplaytesthost3@gmail.com')
                .set('Authorization', `Bearer ${validToken}`)
                .send(TestEvent);
            eventId = createEventRes.body._id;
            const createSuggestionRes = await (0, supertest_1.default)(API_URL)
                .post(`/suggestion/create/${eventId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send(TestSuggestion);
            suggestionId = createSuggestionRes.body._id;
        });
        afterEach(async () => {
            // Clean up the suggestion
            await (0, supertest_1.default)(API_URL).delete(`/event/${eventId}`)
                .set('Authorization', `Bearer ${validToken}`);
            await (0, supertest_1.default)(API_URL).delete(`/suggestion/${suggestionId}`)
                .set('Authorization', `Bearer ${validToken}`);
        });
        it('should update a suggestion', async () => {
            const updatedSuggestion = { accepted: true };
            const res = await (0, supertest_1.default)(API_URL)
                .put(`/suggestion/${suggestionId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send(updatedSuggestion);
            suggestionId = res.body._id;
            expect(res.statusCode).toBe(201);
            expect(res.body.accepted).toEqual(true);
        });
    });
    describe('DELETE /suggestion/:id', () => {
        let suggestionId = '';
        let eventId = '';
        beforeEach(async () => {
            const createEventRes = await (0, supertest_1.default)(API_URL)
                .post('/event/create/qplaytesthost3@gmail.com')
                .set('Authorization', `Bearer ${validToken}`)
                .send(TestEvent);
            eventId = createEventRes.body._id;
            const createSuggestionRes = await (0, supertest_1.default)(API_URL)
                .post(`/suggestion/create/${eventId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send(TestSuggestion);
            suggestionId = createSuggestionRes.body._id;
        });
        afterEach(async () => {
            // Clean up the suggestion
            await (0, supertest_1.default)(API_URL).delete(`/event/${eventId}`)
                .set('Authorization', `Bearer ${validToken}`);
            ;
        });
        it('should delete a suggestion', async () => {
            const res = await (0, supertest_1.default)(API_URL)
                .delete(`/suggestion/${suggestionId}`)
                .set('Authorization', `Bearer ${validToken}`);
            expect(res.statusCode).toBe(204);
        });
    });
});
