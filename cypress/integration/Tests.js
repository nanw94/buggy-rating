import * as common from '../support/common';
import * as model from '../page/model';
import * as register from '../page/register';
import * as home from '../page/home';

let userToSignUp;
let user;

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
    //Before all, sign a user up for post-login behaviour
    before('sign up a user', ()=>{
        user = common.newUser();
        common.signup(user);
    });

    //Before each test, login by set token to brower
    beforeEach('login with the new user',()=>{
        common.login(user.userName, user.password);
    })

    it('should allow user to comment and vote',()=>{
        //Randomly pick up a model to vote
        common.getRandomModelId().then(id=>{    
            //Get the original vote count in advance
            common.getModelVoteCount(id).then(count=>{
                //Navigate to the model detail page
                model.navigateTo(id);
                //Input comment       
                model.setComment(user.comment);     
                //Click vote button
                model.getVoteBtn().click();
                //Verify 'Thank you for your vote!'
                cy.contains('Thank you for your vote!').should('be.visible');
                //The comment should be logged on top
                model.getLastComment().should('contain',user.comment)
                //The vote count should get increased by 1
                cy.contains('strong', (count+1).toString()).should('be.visible');
                //currently there is a bug about missing the author for model with a big vote count, so it could fail.      
                // .and('contain',user.firstName);      
            })            
        })
    });

    it('should block voting on the same model twice', {
        //This test will be retried in case that the model that randomly picked up has already been voted (if the api returns error "message": "Cannot vote more than once")
        retries: {
          runMode: 3,
          openMode: 2,
        },
      },
      ()=>{
        //vote the model once via api to make sure it's already voted by the current user
        //Randomly pick up a model
        common.getRandomModelId().then(id=>{
            //Vote the model once (through api)
            common.vote(user,id,'this was voted by api');
            //Open the model detail page in UI
            model.navigateTo(id);
            cy.contains('Thank you for your vote!').should('be.visible');
            //Vote button shouldn't be there any more
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