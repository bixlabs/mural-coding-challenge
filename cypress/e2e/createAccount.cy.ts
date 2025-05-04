describe('Create Account', () => {
	it('should create a new account and redirect to the home page', () => {
		cy.visit('/accounts/create');

		cy.get('input[name="name"]').type('Test Account');
		cy.get('textarea[name="description"]').type('Test Description');
		cy.get('button[type="submit"]').click();

		cy.get('div[role="alert"]').should('be.visible').and('contain', 'Account created successfully');
		cy.location('pathname').should('eq', '/');
	});

	it('should clear the current account and redirect to the account creation page', () => {
		cy.createAccount({
			name: 'Test Account',
			description: 'Test Description',
		});

		cy.getByTestId('button', 'clear-account').click();
		cy.location('pathname').should('eq', '/accounts/create');
	});
});
