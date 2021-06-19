let faker = require('faker');
const requestURL = 'https://k51qryqov3.execute-api.ap-southeast-2.amazonaws.com/prod';

export function getToken(username, password) {
    return cy.request({
        method: 'POST',
        url: `${requestURL}/oauth/token`,
        form: true,
        body: {
            username: username,
            password: password,
        },
    }).then(resp => {
        expect(resp.status).to.eq(200);
        return resp.body.access_token;
    });
}

function setToken(token) {
    window.localStorage.setItem('token', token);
}

export function login(username, password) {
    return getToken(username,password).then(token=>{
        setToken(token);
    })
}

export function newUser() {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const userName = faker.internet.userName();
    const password = faker.internet.password()+'1'+'!';
    const comment = faker.random.words();
    return {
        firstName,
        lastName,
        userName,
        password,
        comment,
    }
}

export function signup(user) {
    return cy.request({
        method: 'POST',
        url: `${requestURL}/users`,
        body: {
            "username": user.userName,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "password": user.password,
            "confirmPassword": user.password,
        },
    }).then(resp => {
        expect(resp.status).to.eq(201);
    });

}

export function getModels() {
    return cy.request({
        method: 'GET',
        url:`${requestURL}/models`
    }).then(resp=>{
        expect(resp.status).to.eq(200);
        return resp.body;
    })
}

export function getRandomModelId() {
    let index = Math.floor(Math.random() * (4) + 1);
    return getModels().then(resp=>{
        return resp.models[index].id.replace("|", "%7C");
    })
}

export function getToRandomModel() {
    return getRandomModelId().then(id=>{
        return cy.visit(`/model/${id}`);
    })   
}

export function vote(user,model,comment) {
    return getToken(user.userName,user.password).then(token=>{
        cy.request({
            method: 'POST',
            url:`${requestURL}/models/${model}/vote`,
            headers:{
                Authorization: `Bearer ${token}`
            },
            body:{
                comment: comment,
            }
        }).then(resp=>{
            return resp
        })
    })
}

export function getModelVoteCount(modelId) {
    return cy.request({
            method: 'GET',
            url:`${requestURL}/models/${modelId}`
        }).then(resp=>{
            return resp.body.votes;
        })
    }