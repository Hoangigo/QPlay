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
const optionId = "64ac140656528cf9002d2c19";
describe('Vote Option Routes', () => {
    describe('PUT /voteoption/update/count', () => {
        it('should update the count of a vote option', async () => {
            // Make the PUT request to update the vote option count
            const res = await (0, supertest_1.default)(API_URL)
                .put('/voteoption/update/count')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ _id: optionId });
            // Assert the response status code
            expect(res.statusCode).toBe(200);
            // Assert the response body contains the updated vote option
            expect(res.body).toHaveProperty('_id', optionId);
            //expect(res.body).toHaveProperty('count', 1);
        });
    });
});
