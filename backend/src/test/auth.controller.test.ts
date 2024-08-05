import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import request from 'supertest';

dotenv.config();
let API_URL = 'http://localhost:6868/api';
const validToken = jwt.sign({}, process.env.JWT_SECRET_KEY || '');
describe('Token Verification Routes', () => {
  it('should return true for a valid JWT token', async () => {
    const token = 'your_valid_token_here';

    const response = await request(API_URL)
      .post('/auth/verify/token')
      .send({ jwt_token: validToken });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(true);
  });

});