import request from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();
let API_URL = 'http://localhost:6868/api';
const validToken = jwt.sign({}, process.env.JWT_SECRET_KEY || '');


describe('Event Routes', () => {

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

    //event is created beforeEach and deleted afterEach test --> no need to separately test create and delete
    describe('POST event/create/:email', () => {
        //POST: /host --> create a new host
        let eventId ="";

        it('should create an event', async () => {
            const createHost = await request(API_URL)
            .post('/host')
            .send(
                TestHost
            );
            const hostEmail = createHost.body.email;
            const res = await request(API_URL)
              .post(`/event/create/${hostEmail}`)
              .set("Authorization", `Bearer ${validToken}`)
              .send(TestEvent);
            eventId = res.body._id;
            expect(res.statusCode).toBe(201);
            expect(res.body.title).toEqual(TestEvent.title);
            expect(res.body.private).toEqual(true);
            expect(res.body.latitude).toEqual(TestEvent.latitude);
            expect(res.body.messagePrice).toEqual(1);
            const res2 = await request(API_URL)
            .delete(`/event/${eventId}`)
            .set('Authorization', `Bearer ${validToken}`)
            await request(API_URL)
            .delete(`/host/${TestHost.email}`)
            .set('Authorization', `Bearer ${TestHost.token}`);
            expect(res2.statusCode).toBe(204);
        });

    })
    // GET: /event/data/info/:id --> get event info data
  describe('GET /event/data/info/:id', () => {
    let eventId ="";

    beforeEach(async () => {
      const createHost = await request(API_URL)
            .post('/host')
            .send(
                TestHost
            );
      const hostEmail = createHost.body.email;
      const res = await request(API_URL)
        .post(`/event/create/${hostEmail}`)
        .set("Authorization", `Bearer ${validToken}`)
        .send(TestEvent);
      eventId = res.body._id;
    });

    afterEach(async () => {
      await request(API_URL).delete(`/event/${eventId}`).set('Authorization', `Bearer ${validToken}`)
      ;
      await request(API_URL)
            .delete(`/host/${TestHost.email}`)
            .set('Authorization', `Bearer ${TestHost.token}`);
    });

    it('should get event info data', async () => {
      const res = await request(API_URL).get(`/event/data/info/${eventId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toEqual(TestEvent.title);
    });
  });

  // GET: /event/data/vote/:id --> get event vote data
  describe('GET /event/data/vote/:id', () => {
    let eventId ="";

    beforeEach(async () => {
            const createHost = await request(API_URL)
            .post('/host')
            .send(
                TestHost
            );
      const hostEmail = createHost.body.email;
      const res = await request(API_URL)
        .post(`/event/create/${hostEmail}`)
        .set("Authorization", `Bearer ${validToken}`)
        .send(TestEvent);
      eventId = res.body._id;
    });

    afterEach(async () => {
      await request(API_URL).delete(`/event/${eventId}`)
      .set('Authorization', `Bearer ${validToken}`)
      ;
      await request(API_URL)
            .delete(`/host/${TestHost.email}`)
            .set('Authorization', `Bearer ${TestHost.token}`);
    });

    it('should get event vote data', async () => {
      const res = await request(API_URL).get(`/event/data/vote/${eventId}`);
      expect(res.statusCode).toBe(200);

    });
  });

  // GET: /event/data/auction/:id --> get event auction data
  describe('GET /event/data/auction/:id', () => {
    let eventId ="";

    beforeEach(async () => {
      const createHost = await request(API_URL)
            .post('/host')
            .send(
                TestHost
            );
      const hostEmail = createHost.body.email;
      const res = await request(API_URL)
        .post(`/event/create/${hostEmail}`)
        .set("Authorization", `Bearer ${validToken}`)
        .send(TestEvent);
      eventId = res.body._id;
    });

    afterEach(async () => {
      await request(API_URL).delete(`/event/${eventId}`)
      .set('Authorization', `Bearer ${validToken}`)
      ;
      await request(API_URL)
            .delete(`/host/${TestHost.email}`)
            .set('Authorization', `Bearer ${TestHost.token}`);
    });

    it('should get event auction data', async () => {
      const res = await request(API_URL).get(`/event/data/auction/${eventId}`);
      expect(res.statusCode).toBe(200);

    });
  });

  // GET: /event/data/suggestion/:id --> get event suggestion data
  describe('GET /event/data/suggestion/:id', () => {
    let eventId ="";
    beforeEach(async () => {
      const createHost = await request(API_URL)
            .post('/host')
            .send(
                TestHost
            );
      const hostEmail = createHost.body.email;
      const res = await request(API_URL)
        .post(`/event/create/${hostEmail}`)
        .set("Authorization", `Bearer ${validToken}`)
        .send(TestEvent);
      eventId = res.body._id;
    });

    afterEach(async () => {
      await request(API_URL).delete(`/event/${eventId}`)
      .set('Authorization', `Bearer ${validToken}`)
      ;
      await request(API_URL)
            .delete(`/host/${TestHost.email}`)
            .set('Authorization', `Bearer ${TestHost.token}`);
    });

    it('should get event suggestion data', async () => {
      const res = await request(API_URL).
      get(`/event/data/suggestion/${eventId}`).set('Authorization', `Bearer ${validToken}`);
      expect(res.statusCode).toBe(200);
    });
  });



});
