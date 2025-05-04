/// <reference types="cypress" />

Cypress.Commands.add('createAccount', ({ name, description }: { name: string; description: string }) => {
	cy.visit('/accounts/create');
	cy.get('input[name="name"]').type(name);
	cy.get('textarea[name="description"]').type(description);
	cy.get('button[type="submit"]').click();
});

/**
 * Custom Cypress command to select elements by their `data-testid` attribute.
 *
 * Accepts one or two arguments:
 * - With one argument: selects any element matching the given test ID.
 * - With two arguments: selects a specific element type (e.g., 'button') that matches the given test ID.
 *
 * @param {string} elementSelectorOrTestId - If only one argument is provided, it's treated as the test ID.
 *                                           If two arguments are provided, this is treated as the element selector (e.g., 'button').
 * @param {string} [maybeTestId] - Optional. Used as the test ID if the first argument is a selector.
 *
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} A Cypress chainable for further actions.
 *
 * @example
 * // Using only a test ID
 * cy.getByTestId('submit-button'); // → cy.get('[data-testid="submit-button"]')
 *
 * @example
 * // Using an element selector and test ID
 * cy.getByTestId('button', 'submit-button'); // → cy.get('button[data-testid="submit-button"]')
 */

Cypress.Commands.add('getByTestId', (elementSelectorOrTestId: string, maybeTestId?: string) => {
	const testId = maybeTestId ?? elementSelectorOrTestId;
	const elementSelector = maybeTestId ? elementSelectorOrTestId : '';

	let testIdSelector = `[data-testid="${testId}"]`;

	if (elementSelector) {
		testIdSelector = `${elementSelector}${testIdSelector}`;
	}

	return cy.get(testIdSelector);
});
