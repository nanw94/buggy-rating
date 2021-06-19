export function navigateTo(model) {
    return cy.visit(`/model/${model}`);
}

export function getComment() {
    return cy.get('#comment');
}

export function setComment(comment) {
    return getComment().type(comment);
}

export function getVoteBtn() {
    return cy.contains('button','Vote!');
}

export function getLastComment() {
    return cy.get('tbody > :nth-child(1)')
}