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
describe('Vote Option Routes', () => {
    describe('PUT /voteoption/update/count', () => {
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
        const TestVoteActivity = {
            end: '2023-09-12T13:11:57.000+00:00',
            voteOptions: [
                { songId: 'songId1', count: 0 },
            ],
        };
        let voteId = '';
        let eventId = '';
        let voteOptionsIds = [];
        let optionId = '';
        beforeEach(async () => {
            const createHost = await (0, supertest_1.default)(API_URL)
                .post('/host')
                .send(TestHost);
            const hostEmail = createHost.body.email;
            const createEventRes = await (0, supertest_1.default)(API_URL)
                .post(`/event/create/${hostEmail}`)
                .set("Authorization", `Bearer ${validToken}`)
                .send(TestEvent);
            eventId = createEventRes.body._id;
            // Create a vote activity for the event
            const createVoteRes = await (0, supertest_1.default)(API_URL)
                .post(`/vote/create/${eventId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send(TestVoteActivity);
            voteId = createVoteRes.body._id;
            voteOptionsIds = createVoteRes.body.voteOptions.map((option) => option._id);
            optionId = voteOptionsIds[0];
        });
        afterEach(async () => {
            // Clean up the auction
            await (0, supertest_1.default)(API_URL).delete(`/event/${eventId}`)
                .set('Authorization', `Bearer ${validToken}`);
            await (0, supertest_1.default)(API_URL).delete(`/vote/${voteId}`)
                .set('Authorization', `Bearer ${validToken}`);
            await (0, supertest_1.default)(API_URL)
                .delete(`/host/${TestHost.email}`)
                .set('Authorization', `Bearer ${TestHost.token}`);
        });
        it('should update the count of a vote option', async () => {
            // Make the PUT request to update the vote option count
            const res = await (0, supertest_1.default)(API_URL)
                .put('/voteoption/update/count')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ _id: optionId });
            // Assert the response status code
            expect(res.statusCode).toBe(200);
        });
    });
});
