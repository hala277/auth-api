'use strict';

const server = require('../src/server.js');
const supertest = require('supertest');
const { db } = require('../src/auth/models/index.js');
const request = supertest(server.app);


beforeAll(async () => {
    await db.sync();
});

afterAll(async () => {
    await db.drop();
})

describe('test basic auth', () => {

    it('test POST to /signup to create a new user,200 ok', async () => {
        const response = await request.post('/signup').send({
            username: "hala",
            password: "test123"
        });
        expect(response.status).toEqual(201);
        expect(response.body.username).toEqual('hala');
    });

    it('POST to /signin to login as a user (use basic auth)', async () => {
        // console.log('sssssssssssssssssssssssssssssssss');
        const response = await request.post('/signin').auth("hala","test123")
        expect(response.status).toEqual(200);
        expect(response.body.username).toEqual('hala');
        });
       
    });

    