'use strict';

process.env.SECRET = "toes";

const server = require('../src/server');
const supertest = require('supertest');
const request = supertest(server.app);
const { db } = require('../src/auth/models/index.js');


beforeAll(async () => {
    await db.sync();
});

afterAll(async () => {
    await db.drop();
})


describe('Auth Router', () => {



    describe('test auth server basic and bearer', () => {
        it('test POST to /signup to create a new user,200 ok', async () => {
            const response = await request.post('/signup').send({
                username: "hala",
                password: "test123",
                role: "admain"

            });
            expect(response.status).toEqual(201);
            expect(response.body.username).toEqual('hala');
        });

        it('test POST to /signin user,200 ok', async () => {

            const response = await request.post('/signin').auth("hala", "test123")
            expect(response.status).toEqual(200);
            expect(response.body.username).toEqual('hala');
        });



        it('test if the user can signin with bearer/token', async () => {
            const response = await request.post('/signin').auth("hala", "test123")
            const token = response.body.token;
            const bearer= await request
                .get('/secret')
                .set('Authorization', `Bearer ${token}`)
            expect(bearer.status).toBe(200);

        });

    });

   


});