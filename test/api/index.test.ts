import { request } from "../index";


/**
 * Index routes
 */
describe("Index routes test", () => {
  it("should respond with HTTP 404 for missing route", async (done) => {
    const response = await request.get("/api/test");

    expect(response.status).toBe(404);
    done();
  });

});


