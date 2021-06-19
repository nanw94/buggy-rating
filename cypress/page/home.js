export function navigateTo() {
    return cy.visit('/');
}

export function getLogoutLink() {
    return cy.contains('a','Logout').should('be.visible');
}

export function inputLogin(userName) {
    return cy.get('[name="login"]').type(userName);
}

export function inputPassword(password) {
    return cy.get('[name="password"]').type(password);
}

export function getLoginBtn() {
    return cy.contains('button','Login');
}