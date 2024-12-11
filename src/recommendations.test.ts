// import request from 'supertest';
// import app from './app';

// describe('POST /recommendations', () => {
//   it('should generate and save recommendations', async () => {
//     const response = await request(app)
//       .post('/recommendations')
//       .send({
//         user_id: 'test_user',
//         preferences: ['science fiction', 'artificial intelligence', 'space exploration']
//       });

//     expect(response.status).toBe(200);
//     expect(response.body.user_id).toBe('test_user');
//     expect(Array.isArray(response.body.recommendations)).toBe(true);
//   });
// });
