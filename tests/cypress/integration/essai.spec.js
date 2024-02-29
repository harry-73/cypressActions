describe("Map", () => {
	beforeEach(function () {
  cy.task('seed:database');
   //cy.visit("http://localhost:3000/");
});

	it("Log the new user", () => {
		cy.visit("http://localhost:3000/map/-1", {timeout: 600000});
		cy.get('[href="/"]').click();
//		cy.get('.text-3xl').should("eq", 'Welcome to Meteor!');
//		cy.get('.text-xl').should("eq", 'Learn Meteor!');
		//cy.get("input#at-field-email").type("ste.monnier@gmail.com");
		//cy.get("input#at-field-password").type("eeeeee");
		//cy.get("input#at-field-password_again").type("awesome-password");
		// I added a name field on meteor user accounts system
		//		cy.get("input#at-field-name").type("Jean-Peter");
	//	cy.get("button#at-btn").click();

	 });

});
