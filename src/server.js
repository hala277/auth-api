'use strict';

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { User } = require('./auth/models/index.js');
const basicAuth = require('./auth/middleware/basic');
const bearerAuth = require('./auth/middleware/bearer');
const errorHandler = require('./middleware/500.js');
const errorHandler2 = require('./middleware/404.js');
const acl = require('./auth/middleware/oauth');

const app = express();

app.use(express.json());
app.use(cors());

// route
app.get('/', (request, response) => {
    response.send('home route')
})

app.post('/signup', signupFunc);
app.post('/signin', basicAuth(User), signinFunc);
app.get('/secret', bearerAuth(User), userHandler);

app.get('/user', bearerAuth(User), acl('read'), (request, response) => {
    response.status(201).send('you can read this secret');
})

app.post('/user', bearerAuth(User), acl('create'), (request, response) => {
   
    response.status(201).send('new secret has been created');
})

app.put('/user', bearerAuth(User), acl('update'),updateHandller);

app.delete('/user', bearerAuth(User), acl('delete'), (request, response) => {
    response.send('secret deleted');
})




// signup Function
// localhost:3000/signup >> body{username:'hala',password:'123456'}
async function signupFunc(request, response) {
    try {
        request.body.password = await bcrypt.hash(request.body.password, 5);
        const record = await User.create(request.body);
        response.status(201).json(record);
    } catch (error) {
        response.status(403).send("Error occurred");
    }
}

function signinFunc(request, response) {
    response.status(200).json(request.user);
}

function userHandler(request, response) {
    // send the user information to the client & create new repo
    response.status(200).json(request.user);

}

async function updateHandller(request,response){
    let id =request.body.id;
    let obj = request.body;
    let ubdateData = await request.User.update(id,obj);
    response.status(200).json(ubdateData); 
}
// 500 rout handler
app.use(errorHandler);

// 404 rout handler
app.use(errorHandler2);

function start(port) {
    app.listen(port, () => {
        console.log(`running on port ${port}`)
    })
}

module.exports = {
    app: app,
    start: start
}