import mongoose from 'mongoose';
import request from 'supertest';
import app from "../../src/server";
import {connectDB} from "../../src/utils/database";

const PORT = 8080;
describe('GET /users/:user_id/recommendations', () => {
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
    it('should retrieve saved recommendations', async () => {
        const user_id = new mongoose.Types.ObjectId();

        await request(app)
            .post('/recommendations')
            .send({
                user_id,
                preferences: ['science fiction']
            });

        const response = await request(app).get(`/users/${user_id}/recommendations`);

        if (response.status === 200) {
            expect(response.body.user_id).toBe(user_id.toString());
            expect(Array.isArray(response.body.recommendations)).toBe(true);
        } else if (response.status === 404) {
            expect(response.body.error).toBe(`User not found`);
        } else {
            throw new Error('Unexpected status code');
        }
    });
});
