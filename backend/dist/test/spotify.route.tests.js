"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
let API_URL = 'http://localhost:6868/api';
describe('Spotify Routes', () => {
    it('should search for tracks', async () => {
        const searchQuery = '50';
        const response = await (0, supertest_1.default)(API_URL)
            .get('/spotify/search')
            .query({ q: searchQuery });
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('artists');
        expect(response.body[0]).toHaveProperty('images');
    });
    it('should get a track by ID', async () => {
        const trackId = '1';
        const response = await (0, supertest_1.default)(API_URL)
            .get(`/spotify/track/${trackId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', trackId);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('artists');
        expect(response.body).toHaveProperty('images');
    });
});
