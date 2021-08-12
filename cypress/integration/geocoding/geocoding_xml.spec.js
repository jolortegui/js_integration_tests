describe("geocoding api - XML", () => {
  //if variables get to complicated to handle on this file
  //they can be moved to a fixture file
  const apiKey = "AIzaSyBNW9ny7Q9TS1iRLYWgrWo4CwAb3wmrEik";
  const address = "1600+Amphitheatre+Parkway,+Mountain+View,+CA";
  const component =
    "route:Annankatu|administrative_area:Helsinki|country:Finland";
  const bounds = "34.172684,-118.604794|34.236144,-118.500938";

  it("Verify response when sending address", () => {
    cy.request(`/xml?address=${address}&key=${apiKey}`)
      .its("headers")
      .its("content-type")
      .should("include", "application/xml");
  });

  it("Verify response should contain expected result set when sending valid address", () => {
    cy.request(`/xml?address=${address}&key=${apiKey}`).then((response) => {
      const xml = Cypress.$.parseXML(response.body);
      expect(Cypress.$(xml).find("status").text()).to.equal("OK");
      expect(Cypress.$(xml).find("formatted_address").text()).to.equal(
        "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA"
      );
    });
  });

  it("Verify response should contain expected result set when sending valid component", () => {
    cy.request(`/xml?components=${component}&key=${apiKey}`).then(
      (response) => {
        const xml = Cypress.$.parseXML(response.body);
        expect(Cypress.$(xml).find("status").text()).to.equal("OK");
        expect(Cypress.$(xml).find("formatted_address").text()).to.equal(
          "Annankatu, Helsinki, Finland"
        );
      }
    );
  });

  it("Verify response should contain expected result set when using bounds as an optional parameter", () => {
    cy.request(`/xml?address=${address}&bounds=${bounds}&key=${apiKey}`).then(
      (response) => {
        const xml = Cypress.$.parseXML(response.body);
        expect(Cypress.$(xml).find("status").text()).to.equal("OK");
        expect(Cypress.$(xml).find("formatted_address").text()).to.equal(
          "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA"
        );
      }
    );
  });

  it("Verify response should contain expected result set when using language as an optional parameter", () => {
    //using french as language
    cy.request(`/xml?address=${address}&language=fr&key=${apiKey}`).then(
      (response) => {
        const xml = Cypress.$.parseXML(response.body);
        expect(Cypress.$(xml).find("status").text()).to.equal("OK");
        expect(Cypress.$(xml).find("formatted_address").text()).to.equal(
          "1600 Amphitheatre Pkwy, Mountain View, CA 94043, États-Unis"
        );
      }
    );
  });

  it("Verify response when no language has been set", () => {
    cy.request(`/xml?address=上海+中國&key=${apiKey}`).then((response) => {
      const xml = Cypress.$.parseXML(response.body);
      expect(Cypress.$(xml).find("status").text()).to.equal("OK");
      expect(Cypress.$(xml).find("formatted_address").text()).to.equal(
        "Shanghai, China"
      );
    });
  });

  it("Verify response should contain expected result set when using region as an optional parameter", () => {
    cy.request(`/xml?address=Toledo&region=es&key=${apiKey}`).then(
      (response) => {
        const xml = Cypress.$.parseXML(response.body);
        expect(Cypress.$(xml).find("status").text()).to.equal("OK");
        expect(Cypress.$(xml).find("formatted_address").text()).to.equal(
          "Toledo, Spain"
        );
      }
    );
  });

  it("Verify response should contain expected result set when using components as optional parameter", () => {
    cy.request(`/xml?address=cuzco&components=country:Peru&key=${apiKey}`).then(
      (response) => {
        const xml = Cypress.$.parseXML(response.body);
        expect(Cypress.$(xml).find("status").text()).to.equal("OK");
        expect(Cypress.$(xml).find("formatted_address").text()).to.equal(
          "Cusco, Peru"
        );
      }
    );
  });

  it("Verify response should be empty when a non existent address is sent as a parameter", () => {
    cy.request(`/xml?address=randomString&key=${apiKey}`).then((response) => {
      const xml = Cypress.$.parseXML(response.body);
      //results have no content
      expect(Cypress.$(xml).find("status").text()).to.equal("ZERO_RESULTS");
      expect(Cypress.$(xml).find("formatted_address").text()).to.equal("");
    });
  });

  it("Verify proper error message is sent when no api key is sent in the url", () => {
    cy.request(`/xml?address=${address}`).then((response) => {
      const xml = Cypress.$.parseXML(response.body);
      expect(Cypress.$(xml).find("status").text()).to.equal("REQUEST_DENIED");
      expect(Cypress.$(xml).find("error_message").text()).to.equal(
        "You must use an API key to authenticate each request to Google Maps Platform APIs. For additional information, please refer to http://g.co/dev/maps-no-account"
      );
    });
  });

  it("Verify proper error message is sent when no address or component is sent in the url", () => {
    cy.request({ url: `/xml?key=${apiKey}`, failOnStatusCode: false }).then(
      (response) => {
        const xml = Cypress.$.parseXML(response.body);
        expect(Cypress.$(xml).find("status").text()).to.equal(
          "INVALID_REQUEST"
        );
        //error message
        expect(Cypress.$(xml).find("error_message").text()).to.equal(
          "Invalid request. Missing the 'address', 'components', 'latlng' or 'place_id' parameter."
        );
      }
    );
  });

  it("Verify no results are returned when sending components that exclude each other in the url", () => {
    cy.request(
      `/xml?components=administrative_area:TX|country:FR&key=${apiKey}`
    ).then((response) => {
      const xml = Cypress.$.parseXML(response.body);
      expect(Cypress.$(xml).find("status").text()).to.equal("ZERO_RESULTS");
      expect(Cypress.$(xml).find("formatted_address").text()).to.equal("");
    });
  });
});
