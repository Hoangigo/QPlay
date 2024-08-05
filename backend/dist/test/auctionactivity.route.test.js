"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let API_URL = "http://localhost:6868/api";
const validToken = jsonwebtoken_1.default.sign({}, process.env.JWT_SECRET_KEY || "");
describe("Auction Routes", () => {
    const TestEvent = {
        title: "TestEvent",
        longitude: 10.909,
        latitude: 53.13,
        description: "Test for description",
        start: "2023-08-12T13:11:57.000+00:00",
        end: "2023-08-26T13:11:57.000+00:00",
        private: true,
        messagePrice: 1,
        songSuggestionPrice: 1,
    };
    const TestAuction = {
        end: "2023-09-12T13:11:57.000+00:00",
        startPrice: 5,
    };
    describe("GET /event/data/auction/:id", () => {
        let auctionId = "";
        let eventId = "";
        beforeEach(async () => {
            const createEventRes = await (0, supertest_1.default)(API_URL)
                .post("/event/create/qplaytesthost3@gmail.com")
                .set("Authorization", `Bearer ${validToken}`)
                .send(TestEvent);
            eventId = createEventRes.body._id;
            // Create a auction for the event
            const createAuctionRes = await (0, supertest_1.default)(API_URL)
                .post(`/auction/create/${eventId}`)
                .set("Authorization", `Bearer ${validToken}`)
                .send(TestAuction);
            auctionId = createAuctionRes.body._id;
        });
        afterEach(async () => {
            // Clean up the auction
            await (0, supertest_1.default)(API_URL)
                .delete(`/event/${eventId}`)
                .set("Authorization", `Bearer ${validToken}`);
            await (0, supertest_1.default)(API_URL)
                .delete(`/auction/${auctionId}`)
                .set("Authorization", `Bearer ${validToken}`);
        });
        it("should get auctions for an event", async () => {
            const res = await (0, supertest_1.default)(API_URL)
                .get(`/event/data/auction/${eventId}`)
                .set("Authorization", `Bearer ${validToken}`);
            expect(res.statusCode).toBe(200);
            const auctionActivities = res.body.auctionActivities;
            expect(auctionActivities[0].startPrice).toEqual(TestAuction.startPrice);
        });
    });
    describe("POST /auction/create/:eventId", () => {
        let eventId = "";
        let auctionId = "";
        beforeEach(async () => {
            const createEventRes = await (0, supertest_1.default)(API_URL)
                .post("/event/create/qplaytesthost3@gmail.com")
                .set("Authorization", `Bearer ${validToken}`)
                .send(TestEvent);
            eventId = createEventRes.body._id;
        });
        afterEach(async () => {
            // Clean up the auction
            await (0, supertest_1.default)(API_URL)
                .delete(`/event/${eventId}`)
                .set("Authorization", `Bearer ${validToken}`);
            await (0, supertest_1.default)(API_URL)
                .delete(`/auction/${auctionId}`)
                .set("Authorization", `Bearer ${validToken}`);
        });
        it("should create a auction for an event", async () => {
            const res = await (0, supertest_1.default)(API_URL)
                .post(`/auction/create/${eventId}`)
                .set("Authorization", `Bearer ${validToken}`)
                .send(TestAuction);
            auctionId = res.body._id;
            expect(res.statusCode).toBe(201);
        });
    });
    describe("DELETE /auction/:id", () => {
        let auctionId = "";
        let eventId = "";
        beforeEach(async () => {
            const createEventRes = await (0, supertest_1.default)(API_URL)
                .post("/event/create/qplaytesthost3@gmail.com")
                .set("Authorization", `Bearer ${validToken}`)
                .send(TestEvent);
            eventId = createEventRes.body._id;
            const createAuctionRes = await (0, supertest_1.default)(API_URL)
                .post(`/auction/create/${eventId}`)
                .set("Authorization", `Bearer ${validToken}`)
                .send(TestAuction);
            auctionId = createAuctionRes.body._id;
        });
        afterEach(async () => {
            // Clean up the auction
            await (0, supertest_1.default)(API_URL)
                .delete(`/event/${eventId}`)
                .set("Authorization", `Bearer ${validToken}`);
        });
        it("should delete a auction", async () => {
            const res = await (0, supertest_1.default)(API_URL)
                .delete(`/auction/${auctionId}`)
                .set("Authorization", `Bearer ${validToken}`);
            expect(res.statusCode).toBe(204);
        });
    });
});
