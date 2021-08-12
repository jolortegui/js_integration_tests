describe("geocoding api - JSON", () => {
  const apiKey = "AIzaSyBNW9ny7Q9TS1iRLYWgrWo4CwAb3wmrEik";
  const address = "1600+Amphitheatre+Parkway,+Mountain+View,+CA";
  const component =
    "route:Annankatu|administrative_area:Helsinki|country:Finland";
  const bounds = "34.172684,-118.604794|34.236144,-118.500938";

  it("Verify response contain json header when sending address", () => {
    cy.request(`/json?address=${address}&key=${apiKey}`)
      .its("headers")
      .its("content-type")
      .should("include", "application/json");
  });

  it("Verify response should contain expected result set when sending valid address", () => {
    cy.request(`/json?address=${address}&key=${apiKey}`).then((response) => {
      expect(response.body).to.have.property("status", "OK");
      expect(response.body.results[0]).to.have.property(
        "formatted_address",
        "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA"
      );
    });
  });

  it("Verify response should contain expected result set when sending valid component", () => {
    cy.request(`/json?components=${component}&key=${apiKey}`).then(
      (response) => {
        expect(response.body).to.have.property("status", "OK");
        expect(response.body.results[0]).to.have.property(
          "formatted_address",
          "Annankatu, Helsinki, Finland"
        );
      }
    );
  });

  it("Verify response should contain expected result set when using bounds as an optional parameter", () => {
    cy.request(`/json?address=${address}&bounds=${bounds}&key=${apiKey}`).then(
      (response) => {
        expect(response.body).to.have.property("status", "OK");
        expect(response.body.results[0]).to.have.property(
          "formatted_address",
          "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA"
        );
      }
    );
  });

  it("Verify response should contain expected result set when using language as an optional parameter", () => {
    //using french as language
    cy.request(`/json?address=${address}&language=fr&key=${apiKey}`).then(
      (response) => {
        expect(response.body).to.have.property("status", "OK");
        expect(response.body.results[0]).to.have.property(
          "formatted_address",
          "1600 Amphitheatre Pkwy, Mountain View, CA 94043, États-Unis"
        );
      }
    );
  });

  it("Verify response when no language has been set", () => {
    cy.request(`/json?address=上海+中國&key=${apiKey}`).then((response) => {
      expect(response.body).to.have.property("status", "OK");
      expect(response.body.results[0]).to.have.property(
        "formatted_address",
        "Shanghai, China"
      );
    });
  });

  it("Verify response should contain expected result set when using region as an optional parameter", () => {
    cy.request(`/json?address=Toledo&region=es&key=${apiKey}`).then(
      (response) => {
        expect(response.body).to.have.property("status", "OK");
        expect(response.body.results[0]).to.have.property(
          "formatted_address",
          "Toledo, Spain"
        );
      }
    );
  });

  it("Verify response should contain expected result set when using components as optional parameter", () => {
    cy.request(
      `/json?address=cuzco&components=country:Peru&key=${apiKey}`
    ).then((response) => {
      expect(response.body).to.have.property("status", "OK");
      expect(response.body.results[0]).to.have.property(
        "formatted_address",
        "Cusco, Peru"
      );
    });
  });

  it("Verify response should be empty when a non existent address is sent as a parameter", () => {
    cy.request(`/json?address=randomString&key=${apiKey}`).then((response) => {
      expect(response.body).to.have.property("status", "ZERO_RESULTS");
      //results have no content
      expect(response.body.results.length).to.equal(0);
    });
  });

  it("Verify proper error message is sent when no api key is sent in the url", () => {
    cy.request(`/json?address=${address}`).then((response) => {
      expect(response.body).to.have.property("status", "REQUEST_DENIED");
      //error message
      expect(response.body.error_message).to.equal(
        "You must use an API key to authenticate each request to Google Maps Platform APIs. For additional information, please refer to http://g.co/dev/maps-no-account"
      );
    });
  });

  it("Verify proper error message is sent when no address or component is sent in the url", () => {
    cy.request({ url: `/json?key=${apiKey}`, failOnStatusCode: false }).then(
      (response) => {
        expect(response.body).to.have.property("status", "INVALID_REQUEST");
        //error message
        expect(response.body.error_message).to.equal(
          "Invalid request. Missing the 'address', 'components', 'latlng' or 'place_id' parameter."
        );
      }
    );
  });

  it("Verify no results are returned when sending components that exclude each other in the url", () => {
    cy.request(
      `/json?components=administrative_area:TX|country:FR&key=${apiKey}`
    ).then((response) => {
      expect(response.body).to.have.property("status", "ZERO_RESULTS");
      expect(response.body.results.length).to.equal(0);
    });
  });
});
