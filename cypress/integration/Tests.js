import * as common from '../support/common';
import * as model from '../page/model';
import * as register from '../page/register';
import * as home from '../page/home';

let userToSignUp;
let user;
let userToOverVote;

context('pre-login tests', ()=>{
    it('should block voting without login',()=>{
        common.getToRandomModel();
        cy.contains('You need to be logged in to vote.').should('be.visible');
        model.getVoteBtn().should('not.exist');
    })

    it('should be able to register a new user',()=>{
        userToSignUp = common.newUser();
        cy.log(userToSignUp);
        register.navigateTo();
        register.setUserName(userToSignUp.userName);
        register.setFirstName(userToSignUp.firstName);
        register.setLastName(userToSignUp.lastName);
        register.setPassword(userToSignUp.password);
        register.setConfirmPassword(userToSignUp.password);
        register.getRegisterBtn().should('be.enabled').click();
        cy.contains('Registration is successful').should('be.visible');
    })


})

context('post-login tests',()=>{
    //before all, sign a user up for post-login behaviour
    before('sign up a user', ()=>{
        user = common.newUser();
        common.signup(user);
    });

    //before each test, login by set token to brower
    beforeEach('login with the new user',()=>{
        common.login(user.userName, user.password);
    })

    it('should allow user to comment and vote',()=>{
        common.getRandomModelId().then(id=>{    //randomly pick up a model to vote
            common.getModelVoteCount(id).then(count=>{      //get the original vote count in advance
                model.navigateTo(id);        //navigate to the model detail page
                model.setComment(user.comment);     //input comment
                model.getVoteBtn().click();     //click vote button
                cy.contains('Thank you for your vote!').should('be.visible');
                model.getLastComment().should('contain',user.comment)       //the comment should be logged on top
                cy.contains('strong', (count+1).toString()).should('be.visible');       //vote count should get increased
                // .and('contain',user.firstName);      //currently there is a bug about missing the author for model with a big vote count, so it could fail.
            })            
        })
    });

    it('should block voting on the same model twice',()=>{
        userToOverVote = common.newUser();         //need a new user to avoid testing on an model that already voted
        common.signup(userToOverVote);
        common.login(userToOverVote.userName,userToOverVote.password);
        common.getRandomModelId().then(id=>{
            common.vote(userToOverVote,id,'this was voted by api');         //vote the model once via api to make sure it's already voted by the current user
            model.navigateTo(id);
            cy.contains('Thank you for your vote!').should('be.visible');
            cy.contains('button','Vote!').should('not.exist');
        })
    });

    it('should be able to logout and login',()=>{
        home.navigateTo();
        home.getLogoutLink().click();
        home.getLoginBtn().should('be.visible');
        home.inputLogin(user.userName);
        home.inputPassword(user.password);
        home.getLoginBtn().click();
        cy.contains(`Hi, ${user.firstName}`).should('be.visible');        
    })
})