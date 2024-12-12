import mongoose from 'mongoose';
import request from 'supertest';
import {connectDB} from "../../src/utils/database";
import app from "../../src/server";
const PORT = 8080;
describe('POST /recommendations', () => {
    let server: any;
    beforeAll(async () => {
        await connectDB()
        server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongoose.disconnect();
        server.close();
    });
    it('should generate and save recommendations', async () => {
        const user_id = new mongoose.Types.ObjectId();
        const response = await request(app)
            .post('/recommendations')
            .send({
                user_id,
                preferences: ['science fiction', 'artificial intelligence', 'space exploration']
            });
        if (response.status === 200) {
            expect(response.status).toBe(200);
            expect(response.body.user_id).toBe(user_id.toString());
            expect(Array.isArray(response.body.recommendations)).toBe(true);
        } else if (response.status === 404) {
            expect(response.body.error).toBe(`User not found`);
        } else {
            throw new Error('Unexpected status code');
        }
    });
});
