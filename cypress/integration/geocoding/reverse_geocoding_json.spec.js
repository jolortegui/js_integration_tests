describe("reverse geocoding api - JSON", () => {
  const apiKey = "AIzaSyBNW9ny7Q9TS1iRLYWgrWo4CwAb3wmrEik";
  const latlng = "40.714224,-73.96145";
  const latlng_zero_result = "53.477752,-2.266695";
  const place_id = "ChIJd8BlQ2BZwokRAFUEcm_qrcA";

  it("Verify response contain json header when sending an address", () => {
    cy.request(`/json?latlng=${latlng}&key=${apiKey}`)
      .its("headers")
      .its("content-type")
      .should("include", "application/json");
  });

  it("Verify response should contain expected result set when sending valid lat and lgn values", () => {
    cy.request(`/json?latlng=${latlng}&key=${apiKey}`).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("status", "OK");
      expect(response.body.results[0]).to.have.property(
        "formatted_address",
        "277 Bedford Ave, Brooklyn, NY 11211, USA"
      );
    });
  });

  it("Verify response should contain expected result set when sending valid place id", () => {
    cy.request(`/json?place_id=${place_id}&key=${apiKey}`).then((response) => {
      expect(response.status).to.equal(200);
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
        expect(response.status).to.equal(200);
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
        expect(response.status).to.equal(200);
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
      expect(response.status).to.equal(200);
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
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("status", "OK");
      expect(response.body.results[0]).to.have.property(
        "formatted_address",
        "277 Bedford Ave, Brooklyn, NY 11211, USA"
      );
    });
  });

  it("Verify response should contain zero results when result type do not match address sent", () => {
    cy.request({
      url: `/json?latlng=${latlng_zero_result}&result_type=street_address&key=${apiKey}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("status", "ZERO_RESULTS");
      expect(response.body.results.length).to.equal(0);
    });
  });

  it("Verify response should contain expected error message when non-existent result type is sent as an optional parameters", () => {
    cy.request({
      url: `/json?latlng=${latlng}&result_type=NotSupported&key=${apiKey}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("status", "INVALID_REQUEST");
      expect(response.body.error_message).to.equal(
        "Invalid request. Invalid 'result_type' parameter."
      );
    });
  });

  it("Verify response should contain expected error message when non-existent location type is sent as an optional parameters", () => {
    cy.request({
      url: `/json?latlng=${latlng}&location_type=NotSupported&key=${apiKey}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("status", "INVALID_REQUEST");
      expect(response.body.error_message).to.equal(
        "Invalid request. Invalid 'location_type' parameter."
      );
    });
  });

  it("Verify response should contain expected error message when apiKey is not sent", () => {
    cy.request(`/json?latlng=${latlng}&key=`).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("status", "REQUEST_DENIED");
      expect(response.body.error_message).to.equal(
        "You must use an API key to authenticate each request to Google Maps Platform APIs. For additional information, please refer to http://g.co/dev/maps-no-account"
      );
    });
  });

  it("Verify response should contain expected error message when sending invalid place id", () => {
    cy.request({
      url: `/json?place_id=${place_id}12345&key=${apiKey}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("status", "INVALID_REQUEST");
      expect(response.body.error_message).to.equal(
        "Invalid request. Invalid 'place_id' parameter."
      );
    });
  });
});
