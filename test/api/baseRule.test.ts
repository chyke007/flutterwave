import { request } from "../index";
import { NAME, EMAIL, GITHUB, MOBILE} from "../../config";
import { GET_MESSAGE,SUCCESS } from "../../server/utils";

/**
 * Base route
 */
describe("Base route test", () => {
  it("should respond with HTTP 200 for valid route", async (done) => {
    const response = await request.get("/");

    expect(response.status).toBe(200);
    done();
  });

  it("should respond with desired object structure", async (done) => {
    const response = await request.get("/");

    expect(response.body.message).toBeDefined();
    expect(response.body.status).toBeDefined();
    expect(response.body.data.name).toBeDefined();
    expect(response.body.data.github).toBeDefined();
    expect(response.body.data.email).toBeDefined();
    expect(response.body.data.mobile).toBeDefined();
    expect(response.status).toBe(200);
    done();
  });

  
  it("should respond with desired values", async (done) => {
    const response = await request.get("/");

    expect(response.body.message).toBe(GET_MESSAGE);
    expect(response.body.status).toBe(SUCCESS);
   
    expect(response.body.data.name).toBe(NAME);
    expect(response.body.data.github).toBe(GITHUB);
    expect(response.body.data.email).toBe(EMAIL);
    expect(response.body.data.mobile).toBe(MOBILE);

    expect(response.status).toBe(200);
    done();
  });
});


