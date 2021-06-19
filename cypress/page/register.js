export function navigateTo() {
    return cy.visit('/register');
}

export function setUserName(userName) {
    return cy.get('#username').type(userName);
}

export function setFirstName(firstName) {
    return cy.get('#firstName').type(firstName);

}

export function setLastName(lastName) {
    return cy.get('#lastName').type(lastName);

}

export function setPassword(password) {
    return cy.get('#password').type(password);
}

export function setConfirmPassword(confirmPassword) {
    return cy.get('#confirmPassword').type(confirmPassword);
}

export function getRegisterBtn() {
    return cy.contains('button','Register');
}