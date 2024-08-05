"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const supertest_1 = __importDefault(require("supertest"));
dotenv_1.default.config();
let API_URL = 'http://localhost:6868/api';
const validToken = jsonwebtoken_1.default.sign({}, process.env.JWT_SECRET_KEY || '');
describe('Token Verification Routes', () => {
    it('should return true for a valid JWT token', async () => {
        const token = 'your_valid_token_here';
        const response = await (0, supertest_1.default)(API_URL)
            .post('/auth/verify/token')
            .send({ jwt_token: validToken });
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(true);
    });
});
