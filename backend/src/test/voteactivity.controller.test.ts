import request from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();
let API_URL = 'http://localhost:6868/api';
const validToken = jwt.sign({}, process.env.JWT_SECRET_KEY || '');
describe('Vote Routes', () => {
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
          { songId: 'songId1',count :0 },
        
        ],
      };
      
    describe('GET /event/data/vote/:id', () => {
      let voteId = '';
      let eventId ='';
      let voteOptionsIds: string[] = [];

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
        // Create a vote activity for the event
        const createVoteRes = await request(API_URL)
          .post(`/vote/create/${eventId}`)
          .set('Authorization', `Bearer ${validToken}`)
          .send(TestVoteActivity);
        
          voteId = createVoteRes.body._id;
          voteOptionsIds = createVoteRes.body.voteOptions.map((option: any) => option._id);

      });
      afterEach(async () => {
        // Clean up the auction

        await request(API_URL).delete(`/event/${eventId}`)
        .set('Authorization', `Bearer ${validToken}`);
        await request(API_URL).delete(`/vote/${voteId}`)
        .set('Authorization', `Bearer ${validToken}`)
        await request(API_URL)
            .delete(`/host/${TestHost.email}`)
            .set('Authorization', `Bearer ${TestHost.token}`);
        await Promise.all(
            voteOptionsIds.map(async (optionId) => {
              await request(API_URL)
                .delete(`/vote-option/${optionId}`)
                .set('Authorization', `Bearer ${validToken}`);
            })
          );        

      ;
      });
  
      it('should get votes for an event', async () => {
        const res = await request(API_URL).get(`/event/data/auction/${eventId}`).set('Authorization', `Bearer ${validToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.voteActivities.length).toBe(1);
        expect(res.body.voteActivities[0]).toBe(voteId);

      });
    });
    
    describe('POST /vote/create/:eventId', () => {
      let eventId = '';
      let voteId = '';
      let voteOptionsIds: string[] = [];


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
        await request(API_URL).delete(`/event/${eventId}`)
        .set('Authorization', `Bearer ${validToken}`);
        await request(API_URL).delete(`/vote/${voteId}`)
        .set('Authorization', `Bearer ${validToken}`)
        await request(API_URL)
            .delete(`/host/${TestHost.email}`)
            .set('Authorization', `Bearer ${TestHost.token}`);
      ;
      await Promise.all(
        voteOptionsIds.map(async (optionId) => {
          await request(API_URL)
            .delete(`/vote-option/${optionId}`)
            .set('Authorization', `Bearer ${validToken}`);
        })
      );        

  ;
      });
  
      it('should create a vote for an event', async () => {
        const res = await request(API_URL)
          .post(`/vote/create/${eventId}`)
          .set('Authorization', `Bearer ${validToken}`)
          .send(TestVoteActivity);
        voteId= res.body._id;
        voteOptionsIds = res.body.voteOptions.map((option: any) => option._id);

        expect(res.statusCode).toBe(201);
        //expect(res.body.voteOptions.length).toBe(TestVoteActivity.voteOptions.length);

      });
    });
    
    describe('DELETE /vote/:id', () => {
      let voteId = '';
      let eventId = '';
      let voteOptionsIds: string[] = [];

  
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
  
        const createVoteRes = await request(API_URL)
          .post(`/vote/create/${eventId}`)
          .set('Authorization', `Bearer ${validToken}`)
          .send(TestVoteActivity);
  
          voteId = createVoteRes.body._id;
          voteOptionsIds = createVoteRes.body.voteOptions.map((option: any) => option._id);

      });
      afterEach(async () => {
        // Clean up the auction
        await request(API_URL).delete(`/event/${eventId}`)
        .set('Authorization', `Bearer ${validToken}`);
         await request(API_URL)
            .delete(`/host/${TestHost.email}`)
            .set('Authorization', `Bearer ${TestHost.token}`);
        await Promise.all(
            voteOptionsIds.map(async (optionId) => {
              await request(API_URL)
                .delete(`/vote-option/${optionId}`)
                .set('Authorization', `Bearer ${validToken}`);
            })
          );   
        
      ;
      });
  
      it('should delete a vote', async () => {
        const res = await request(API_URL)
          .delete(`/vote/${voteId}`)
          .set('Authorization', `Bearer ${validToken}`);

        expect(res.statusCode).toBe(204);
      });
    });
  });