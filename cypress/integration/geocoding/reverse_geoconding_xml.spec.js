describe("reverse geocoding api - XML", () => {
  const apiKey = "AIzaSyBNW9ny7Q9TS1iRLYWgrWo4CwAb3wmrEik";
  const latlng = "40.714224,-73.96145";

  it("Verify response contain xml header when sending an address", () => {
    cy.request(`/xml?latlng=${latlng}&key=${apiKey}`)
      .its("headers")
      .its("content-type")
      .should("include", "application/xml");
  });

  it("Verify response should contain expected result set when sending lat and lgn values", () => {
    cy.request(`/xml?latlng=${latlng}&key=${apiKey}`).then((response) => {
      const xml = Cypress.$.parseXML(response.body);
      expect(Cypress.$(xml).find("status").text()).to.equal("OK");
      expect(Cypress.$(xml).find("formatted_address").text()).to.contains(
        "277 Bedford Ave, Brooklyn, NY 11211, USA"
      );
    });
  });

  it("Verify response should contain expected result set when using language as an optional parameter", () => {
    cy.request(`/xml?latlng=${latlng}&language=fr&key=${apiKey}`).then(
      (response) => {
        const xml = Cypress.$.parseXML(response.body);
        expect(Cypress.$(xml).find("status").text()).to.equal("OK");
        expect(Cypress.$(xml).find("formatted_address").text()).to.contains(
          "277 Bedford Ave, Brooklyn, NY 11211, États-Unis"
        );
      }
    );
  });

  it("Verify response should contain expected result set when using result_type as an optional parameter", () => {
    cy.request(`/xml?latlng=${latlng}&result_type=country&key=${apiKey}`).then(
      (response) => {
        const xml = Cypress.$.parseXML(response.body);
        expect(Cypress.$(xml).find("status").text()).to.equal("OK");
        expect(Cypress.$(xml).find("formatted_address").text()).to.equal(
          "United States"
        );
      }
    );
  });

  it("Verify response should contain expected result set when using location_type as an optional parameter", () => {
    cy.request(
      `/xml?latlng=${latlng}&location_type=APPROXIMATE&key=${apiKey}`
    ).then((response) => {
      const xml = Cypress.$.parseXML(response.body);
      expect(Cypress.$(xml).find("status").text()).to.equal("OK");
      expect(Cypress.$(xml).find("formatted_address").text()).to.contains(
        "South Williamsburg, Brooklyn, NY, USA"
      );
    });
  });

  it("Verify response should contain expected result set when using location_type and result_type as an optional parameters", () => {
    cy.request(
      `/xml?latlng=${latlng}&location_type=ROOFTOP&result_type=street_address&key=${apiKey}`
    ).then((response) => {
      const xml = Cypress.$.parseXML(response.body);
      expect(Cypress.$(xml).find("status").text()).to.equal("OK");
      expect(Cypress.$(xml).find("formatted_address").text()).to.equal(
        "277 Bedford Ave, Brooklyn, NY 11211, USA"
      );
    });
  });
});
