"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
let API_URL = 'http://localhost:6868/api';
describe('Host Routes', () => {
    //Test Host
    const TestHost = {
        name: 'TestHost',
        newName: 'TestHostNew',
        email: 'qplaytesthost187@gmail.com',
        newEmail: 'qplaytesthost257@gmail.com',
        password: 'TestHost_123',
        newPassword: 'TestHost_1234',
        token: null,
        id: null,
        isConfirmed: false,
        resetPasswordToken: null
    };
    //Host is created beforeEach and deleted afterEach test --> no need to separately test create and delete
    describe('POST /host', () => {
        //POST: /host --> create a new host
        beforeEach(async () => {
            const res = await (0, supertest_1.default)(API_URL)
                .post('/host')
                .send({
                name: TestHost.name,
                email: TestHost.email,
                password: TestHost.password
            });
            expect(res.statusCode).toBe(201);
            expect(res.body.name).toEqual(TestHost.name);
            expect(res.body.email).toEqual(TestHost.email);
            expect(res.body.isConfirmed).toEqual(false);
        });
        //DELETE: /host/:email --> delete the host created in beforeEach
        afterEach(async () => {
            const res = await (0, supertest_1.default)(API_URL)
                .delete(`/host/${TestHost.email}`)
                .set('Authorization', `Bearer ${TestHost.token}`);
            expect(res.statusCode).toBe(204);
        });
        //POST: /host/login
        it('should login a host', async () => {
            const res = await (0, supertest_1.default)(API_URL)
                .post('/host/login')
                .send({
                email: TestHost.email,
                password: TestHost.password
            });
            TestHost.token = res.body.token;
            TestHost.id = res.body._id;
            expect(res.statusCode).toBe(201);
            expect(res.body.token).toBeDefined();
            expect(res.body.email).toEqual(TestHost.email);
        });
        //POST: /host/change/password/:email
        it('should change a host password', async () => {
            const preRes = await (0, supertest_1.default)(API_URL).post('/host/login').send({
                email: TestHost.email,
                password: TestHost.password
            });
            TestHost.token = preRes.body.token;
            TestHost.id = preRes.body._id;
            expect(preRes.statusCode).toBe(201);
            expect(preRes.body.token).toBeDefined();
            expect(preRes.body.email).toEqual(TestHost.email);
            const res = await (0, supertest_1.default)(API_URL)
                .post(`/host/change/password/${TestHost.email}`)
                .set('Authorization', `Bearer ${TestHost.token}`)
                .send({
                oldPassword: TestHost.password,
                newPassword: TestHost.newPassword
            });
            expect(res.statusCode).toBe(201);
        });
        it('should reset a host password', async () => {
            //login host
            const preRes = await (0, supertest_1.default)(API_URL).post('/host/login').send({
                email: TestHost.email,
                password: TestHost.password
            });
            TestHost.token = preRes.body.token;
            TestHost.id = preRes.body._id;
            expect(preRes.statusCode).toBe(201);
            //reset password request
            const resetRequestRes = await (0, supertest_1.default)(API_URL)
                .post('/host/password/reset-request')
                .send({
                email: TestHost.email
            });
            expect(resetRequestRes.statusCode).toBe(200);
            //get host by email
            const getHostByEmailRes = await (0, supertest_1.default)(API_URL)
                .get(`/host/${TestHost.email}`)
                .set('Authorization', `Bearer ${TestHost.token}`);
            expect(getHostByEmailRes.statusCode).toBe(200);
            TestHost.resetPasswordToken = getHostByEmailRes.body.resetPasswordToken;
            //confirm reset password token
            const confirmResetRes = await (0, supertest_1.default)(API_URL)
                .post('/host/password/reset/confirm-token')
                .send({
                token: TestHost.resetPasswordToken
            });
            expect(confirmResetRes.statusCode).toBe(200);
            //reset password
            const resetRes = await (0, supertest_1.default)(API_URL)
                .post('/host/password/reset')
                .send({
                token: TestHost.resetPasswordToken,
                password: TestHost.newPassword
            });
            expect(resetRes.statusCode).toBe(201);
            expect(resetRes.body.password).toBeDefined();
        });
    });
    //Host is created beforeEach and deleted afterEach test --> no need to separately test create and delete
    describe('PUT /host', () => {
        beforeEach(async () => {
            const res = await (0, supertest_1.default)(API_URL)
                .post('/host')
                .send({
                name: TestHost.name,
                email: TestHost.email,
                password: TestHost.password
            });
            expect(res.statusCode).toBe(201);
            expect(res.body.name).toEqual(TestHost.name);
            expect(res.body.email).toEqual(TestHost.email);
            expect(res.body.isConfirmed).toEqual(false);
        });
        afterEach(async () => {
            const res = await (0, supertest_1.default)(API_URL)
                .delete(`/host/${TestHost.newEmail}`)
                .set('Authorization', `Bearer ${TestHost.token}`);
            expect(res.statusCode).toBe(204);
        });
        it('should update a host', async () => {
            const preRes = await (0, supertest_1.default)(API_URL).post('/host/login').send({
                email: TestHost.email,
                password: TestHost.password
            });
            TestHost.token = preRes.body.token;
            TestHost.id = preRes.body._id;
            expect(preRes.statusCode).toBe(201);
            expect(preRes.body.token).toBeDefined();
            expect(preRes.body.email).toEqual(TestHost.email);
            const res = await (0, supertest_1.default)(API_URL)
                .put(`/host/${TestHost.email}`)
                .set('Authorization', `Bearer ${TestHost.token}`)
                .send({
                name: TestHost.newName,
                email: TestHost.newEmail
            });
            expect(res.statusCode).toBe(201);
            expect(res.body.name).toEqual(TestHost.newName);
            expect(res.body.email).toEqual(TestHost.newEmail);
        });
    });
    //Host is created beforeEach and deleted afterEach test --> no need to separately test create and delete
    describe('GET /host', () => {
        beforeEach(async () => {
            const res = await (0, supertest_1.default)(API_URL)
                .post('/host')
                .send({
                name: TestHost.name,
                email: TestHost.email,
                password: TestHost.password
            });
            expect(res.statusCode).toBe(201);
            expect(res.body.name).toEqual(TestHost.name);
            expect(res.body.email).toEqual(TestHost.email);
            expect(res.body.isConfirmed).toEqual(false);
        });
        afterEach(async () => {
            const res = await (0, supertest_1.default)(API_URL)
                .delete(`/host/${TestHost.email}`)
                .set('Authorization', `Bearer ${TestHost.token}`);
            expect(res.statusCode).toBe(204);
        });
        it('should get a host by email', async () => {
            const preRes = await (0, supertest_1.default)(API_URL).post('/host/login').send({
                email: TestHost.email,
                password: TestHost.password
            });
            TestHost.token = preRes.body.token;
            TestHost.id = preRes.body._id;
            expect(preRes.statusCode).toBe(201);
            expect(preRes.body.token).toBeDefined();
            expect(preRes.body.email).toEqual(TestHost.email);
            const res = await (0, supertest_1.default)(API_URL)
                .get(`/host/${TestHost.email}`)
                .set('Authorization', `Bearer ${TestHost.token}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.name).toEqual(TestHost.name);
            expect(res.body.email).toEqual(TestHost.email);
        });
    });
});
