describe('Create Account', () => {
	it('should create a new account and clear the form', () => {
		cy.visit('/accounts/create');

		cy.get('input[name="name"]').type('Test Account');
		cy.get('textarea[name="description"]').type('Test Description');
		cy.get('button[type="submit"]').click();

		cy.get('div[role="alert"]').should('be.visible').and('contain', 'Account created successfully');

		cy.get('input[name="name"]').should('have.value', '');
		cy.get('textarea[name="description"]').should('have.value', '');
	});

	it('should show an error when name is empty and should not show description error', () => {
		cy.visit('/accounts/create');

		cy.get('button[type="submit"]').click();

		cy.getByTestId('name-error').should('be.visible').and('contain', 'Your account name is required');
		cy.getByTestId('description-error').should('not.exist');
	});

	it('should show an error when description is less than 2 characters', () => {
		cy.visit('/accounts/create');

		cy.get('textarea[name="description"]').type('A');
		cy.get('button[type="submit"]').click();

		cy.getByTestId('description-error')
			.should('be.visible')
			.and('contain', 'Description must be at least 2 characters');
	});
});
