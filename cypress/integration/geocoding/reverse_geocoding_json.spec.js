describe("reverse geocoding api - JSON", () => {
  const apiKey = "AIzaSyBNW9ny7Q9TS1iRLYWgrWo4CwAb3wmrEik";
  const latlng = "40.714224,-73.96145";

  it("Verify response contain json header when sending an address", () => {
    cy.request(`/json?latlng=${latlng}&key=${apiKey}`)
      .its("headers")
      .its("content-type")
      .should("include", "application/json");
  });

  it("Verify response should contain expected result set when sending valid lat and lgn values", () => {
    cy.request(`/json?latlng=${latlng}&key=${apiKey}`).then((response) => {
      expect(response.body).to.have.property("status", "OK");
      expect(response.body.results[0]).to.have.property(
        "formatted_address",
        "277 Bedford Ave, Brooklyn, NY 11211, USA"
      );
    });
  });

  it("Verify response should contain expected result set when using language as an optional parameter", () => {
    cy.request(`/json?latlng=${latlng}&language=fr&key=${apiKey}`).then(
      (response) => {
        expect(response.body).to.have.property("status", "OK");
        expect(response.body.results[0]).to.have.property(
          "formatted_address",
          "277 Bedford Ave, Brooklyn, NY 11211, États-Unis"
        );
      }
    );
  });

  it("Verify response should contain expected result set when using result_type as an optional parameter", () => {
    cy.request(`/json?latlng=${latlng}&result_type=country&key=${apiKey}`).then(
      (response) => {
        expect(response.body).to.have.property("status", "OK");
        expect(response.body.results[0]).to.have.property(
          "formatted_address",
          "United States"
        );
      }
    );
  });

  it("Verify response should contain expected result set when using location_type as an optional parameter", () => {
    cy.request(
      `/json?latlng=${latlng}&location_type=APPROXIMATE&key=${apiKey}`
    ).then((response) => {
      expect(response.body).to.have.property("status", "OK");
      expect(response.body.results[0]).to.have.property(
        "formatted_address",
        "South Williamsburg, Brooklyn, NY, USA"
      );
    });
  });

  it("Verify response should contain expected result set when using location_type and result_type as an optional parameters", () => {
    cy.request(
      `/json?latlng=${latlng}&location_type=ROOFTOP&result_type=street_address&key=${apiKey}`
    ).then((response) => {
      expect(response.body).to.have.property("status", "OK");
      expect(response.body.results[0]).to.have.property(
        "formatted_address",
        "277 Bedford Ave, Brooklyn, NY 11211, USA"
      );
    });
  });
});
