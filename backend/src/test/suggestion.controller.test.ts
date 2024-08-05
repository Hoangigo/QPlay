import request from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();
let API_URL = 'http://localhost:6868/api';
const validToken = jwt.sign({}, process.env.JWT_SECRET_KEY || '');
describe('Suggestion Routes', () => {
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
    const TestSuggestion = {
        songId: "1",
        message: "happy birthday",
        boosted: false
    }
    describe('GET /suggestion/:id', () => {
      let suggestionId = '';
      let eventId ='';
      beforeEach(async () => {
      const createHost = await request(API_URL)
        .post('/host')
        .send(
            TestHost
        );
      const hostEmail = createHost.body.email;
      const createEventRes = await request(API_URL)
        .post(`/event/create/${hostEmail}`)
        .set("Authorization", `Bearer ${validToken}`)
        .send(TestEvent);
        
        eventId = createEventRes.body._id;
        // Create a suggestion for the event
        const createSuggestionRes = await request(API_URL)
          .post(`/suggestion/create/${eventId}`)
          .set('Authorization', `Bearer ${validToken}`)
          .send(TestSuggestion);
        
        suggestionId = createSuggestionRes.body._id;
      });
      afterEach(async () => {
        // Clean up the suggestion
        await request(API_URL).delete(`/event/${eventId}`)
        .set('Authorization', `Bearer ${validToken}`);
        await request(API_URL).delete(`/suggestion/${suggestionId}`)
        .set('Authorization', `Bearer ${validToken}`)
        await request(API_URL)
            .delete(`/host/${TestHost.email}`)
            .set('Authorization', `Bearer ${TestHost.token}`);
      ;
      });
  
      it('should get suggestions for an event', async () => {
        const res = await request(API_URL).get(`/event/data/suggestion/${eventId}`).set('Authorization', `Bearer ${validToken}`);
        expect(res.statusCode).toBe(200);
        const suggestions = res.body.suggestions;
        expect(suggestions[0].songId).toEqual(TestSuggestion.songId);
        expect(suggestions[0]._id).toEqual(suggestionId);
        expect(suggestions[0].message).toEqual(TestSuggestion.message);


      });
    });
  
    describe('POST /suggestion/create/:eventId', () => {
      let eventId = '';
      let suggestionId ='';
      beforeEach(async () => {
        const createHost = await request(API_URL)
        .post('/host')
        .send(
            TestHost
        );
      const hostEmail = createHost.body.email;
      const createEventRes = await request(API_URL)
        .post(`/event/create/${hostEmail}`)
        .set("Authorization", `Bearer ${validToken}`)
        .send(TestEvent);
  
        eventId = createEventRes.body._id;
      });
      afterEach(async () => {
        // Clean up the suggestion
        await request(API_URL).delete(`/event/${eventId}`)
        .set('Authorization', `Bearer ${validToken}`);
        await request(API_URL).delete(`/suggestion/${suggestionId}`)
        .set('Authorization', `Bearer ${validToken}`)
        await request(API_URL)
            .delete(`/host/${TestHost.email}`)
            .set('Authorization', `Bearer ${TestHost.token}`);
      ;
      });
  
      it('should create a suggestion for an event', async () => {
        const res = await request(API_URL)
          .post(`/suggestion/create/${eventId}`)
          .set('Authorization', `Bearer ${validToken}`)
          .send(TestSuggestion);
        suggestionId= res.body._id;
  
        expect(res.statusCode).toBe(201);
      });
    });
  
    describe('PUT /suggestion/:id', () => {
      let suggestionId = '';
      let eventId = '';

      beforeEach(async () => {
        const createHost = await request(API_URL)
            .post('/host')
            .send(TestHost);
      const hostEmail = createHost.body.email;
      const createEventRes = await request(API_URL)
        .post(`/event/create/${hostEmail}`)
        .set("Authorization", `Bearer ${validToken}`)
        .send(TestEvent);
  
        eventId = createEventRes.body._id;
  
        const createSuggestionRes = await request(API_URL)
          .post(`/suggestion/create/${eventId}`)
          .set('Authorization', `Bearer ${validToken}`)
          .send(TestSuggestion);
  
        suggestionId = createSuggestionRes.body._id;
      });
      afterEach(async () => {
        // Clean up the suggestion
        await request(API_URL).delete(`/event/${eventId}`)
        .set('Authorization', `Bearer ${validToken}`);
        await request(API_URL).delete(`/suggestion/${suggestionId}`)
        .set('Authorization', `Bearer ${validToken}`)
        await request(API_URL)
            .delete(`/host/${TestHost.email}`)
            .set('Authorization', `Bearer ${TestHost.token}`);
      ;
      });
  
      it('should update a suggestion', async () => {
        const updatedSuggestion = { accepted: true };
  
        const res = await request(API_URL)
          .put(`/suggestion/${suggestionId}`)
          .set('Authorization', `Bearer ${validToken}`)
          .send(updatedSuggestion);
        suggestionId= res.body._id;
  
        expect(res.statusCode).toBe(201);
        expect(res.body.accepted).toEqual(true);
      });
    });
  
    describe('DELETE /suggestion/:id', () => {
      let suggestionId = '';
      let eventId = '';

      beforeEach(async () => {
        const createHost = await request(API_URL)
            .post('/host')
            .send(TestHost);
      const hostEmail = createHost.body.email;
      const createEventRes = await request(API_URL)
        .post(`/event/create/${hostEmail}`)
        .set("Authorization", `Bearer ${validToken}`)
        .send(TestEvent);
  
        eventId = createEventRes.body._id;
  
        const createSuggestionRes = await request(API_URL)
          .post(`/suggestion/create/${eventId}`)
          .set('Authorization', `Bearer ${validToken}`)
          .send(TestSuggestion);
  
        suggestionId = createSuggestionRes.body._id;
      });
      afterEach(async () => {
        // Clean up the suggestion
        await request(API_URL).delete(`/event/${eventId}`)
        .set('Authorization', `Bearer ${validToken}`);
        await request(API_URL)
            .delete(`/host/${TestHost.email}`)
            .set('Authorization', `Bearer ${TestHost.token}`);
      ;
      });
  
      it('should delete a suggestion', async () => {
        const res = await request(API_URL)
          .delete(`/suggestion/${suggestionId}`)
          .set('Authorization', `Bearer ${validToken}`);
  
        expect(res.statusCode).toBe(204);
      });
    });
  });