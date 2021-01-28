import { request } from "../index";
import {CONTAINS, ERROR, EQ,FIELD_VAL_FAIL, FIELD_VAL_SUCC,FIELD_REQ,GT, GTE, INVALID_DATA,INVALID_PAYLOAD,INVALID_RULE,MISSING_FROM_DATA,MISSING_FROM_RULE,NEQ, SUCCESS, TOO_MUCH_NESTING } from "../../server/utils";

const data1 = {
    "rule": {
      "field": "missions",
      "condition": GTE,
      "condition_value": 30
    },
    "data": {
      "name": "James Holden",
      "crew": "Rocinante",
      "age": 34,
      "position": "Captain",
      "missions": 45
    }
  };
  
const data2 = {
    "rule": {
      "field": "missions",
      "condition": GTE,
      "condition_value": 54
    },
    "data": {
      "name": "James Holden",
      "crew": "Rocinante",
      "age": 34,
      "position": "Captain",
      "missions": 45
    }
  };
/**
 * Validate route
 */
describe("validate route test", () => {
  it("should respond with HTTP 200 for valid route", async (done) => {
    const response = await request.post("/validate-rule");

    expect(response.status).toBe(200);
    done();
  });
  it("should respond with HTTP 200 for valid input and passed validation", async (done) => {
    const response = await request.post("/validate-rule")
    .send(data1)
    .set("Accept", "application/json");
    
    expect(response.body.message).toBe(FIELD_VAL_SUCC(data1.rule.field));
    expect(response.body.status).toBe(SUCCESS);
   
    expect(response.body.data.validation.error).toBe(false);
    expect(response.body.data.validation.field).toBe(data1.rule.field);
    expect(response.body.data.validation.field_value).toBe(data1.data[data1.rule.field]);
    expect(response.body.data.validation.condition).toBe(data1.rule.condition);
    expect(response.body.data.validation.condition_value).toBe(data1.rule.condition_value);

    expect(response.status).toBe(200);
    done();
  });

  it("should respond with error message for valid input but failed validation", async (done) => {
    const response = await request.post("/validate-rule")
    .send(data2)
    .set("Accept", "application/json");
    
    expect(response.body.message).toBe(FIELD_VAL_FAIL(data2.rule.field));
    expect(response.body.status).toBe(ERROR);
   
    expect(response.body.data.validation.error).toBe(false);
    expect(response.body.data.validation.field).toBe(data2.rule.field);
    expect(response.body.data.validation.field_value).toBe(data2.data[data2.rule.field]);
    expect(response.body.data.validation.condition).toBe(data2.rule.condition);
    expect(response.body.data.validation.condition_value).toBe(data2.rule.condition_value);

    expect(response.status).toBe(400);
    done();
  });

  it("should respond with error message for invalid JSON payload - (rule)", async (done) => {
    //empty payload
    const response = await request.post("/validate-rule")
    .send()
    .set("Accept", "application/json");
    
    expect(response.body.message).toBe(INVALID_PAYLOAD);
    expect(response.body.status).toBe(ERROR);
    expect(response.status).toBe(400);

    //Invalid payload
    const response2 = await request.post("/validate-rule")
    .send({})
    .set("Accept", "application/json");
    
    expect(response2.body.message).toBe(INVALID_PAYLOAD);
    expect(response.body.data).toBe(null);
    expect(response2.body.status).toBe(ERROR);
    expect(response2.status).toBe(400);
    done();
  });



  it("should respond with error message for missing value - (rule)", async (done) => {
    const response = await request.post("/validate-rule")
    .send({
        "data": {
            "name": "James Holden",
            "crew": "Rocinante",
            "age": 34,
            "position": "Captain",
            "missions": 45
          }
    })
    .set("Accept", "application/json");

    expect(response.body.message).toBe(FIELD_REQ("rule"));
    expect(response.body.data).toBe(null);
    expect(response.body.status).toBe(ERROR);
    expect(response.status).toBe(400);
    done();
  });

  it("should respond with error message for missing value - (data)", async (done) => {
    const response = await request.post("/validate-rule")
    .send({
        "rule": {
            "field": "missions",
            "condition": GTE,
            "condition_value": 30
          }
    })
    .set("Accept", "application/json");
    expect(response.body.message).toBe(FIELD_REQ("data"));
    expect(response.body.data).toBe(null);
    expect(response.body.status).toBe(ERROR);
    expect(response.status).toBe(400);

    //When null is passed
    const response2 = await request.post("/validate-rule")
    .send({
        "rule": {
            "field": "missions",
            "condition": GTE,
            "condition_value": 30
          },
          "data":null
    })
    .set("Accept", "application/json");
    expect(response2.body.message).toBe(FIELD_REQ("data"));
    expect(response2.body.data).toBe(null);
    expect(response2.body.status).toBe(ERROR);
    done();
  });

  
  it("should respond with error message for invalid rule", async (done) => {
    const response = await request.post("/validate-rule")
    .send({
        "data": {
            "name": "James Holden",
            "crew": "Rocinante",
            "age": 34,
            "position": "Captain",
            "missions": 45
          },
          "rule":2
    })
    .set("Accept", "application/json");
    expect(response.body.message).toBe(INVALID_RULE);
    expect(response.body.data).toBe(null);
    expect(response.body.status).toBe(ERROR);
    expect(response.status).toBe(400);
    done();
  });

  it("should respond with error message for invalid data", async (done) => {
    const response = await request.post("/validate-rule")
    .send({
        "data": 9,
        "rule": {
            "field": "missions",
            "condition": GTE,
            "condition_value": 30
          }
    })
    .set("Accept", "application/json");
    expect(response.body.message).toBe(INVALID_DATA);
    expect(response.body.data).toBe(null);
    expect(response.body.status).toBe(ERROR);
    expect(response.status).toBe(400);
    done();
  });
          
it("should respond with error message for missing property in rule - field ", async (done) => {
    const response = await request.post("/validate-rule")
    .send({
        "data": {
            "name": "James Holden",
            "crew": "Rocinante",
            "age": 34,
            "position": "Captain",
            "missions": 45
          },
          "rule":{
            "condition": GTE,
            "condition_value": 30
          }
    })
    .set("Accept", "application/json");
    expect(response.body.message).toBe(MISSING_FROM_RULE("field"));
    expect(response.body.data).toBe(null);
    expect(response.body.status).toBe(ERROR);
    expect(response.status).toBe(400);

    //When null is passed
    const response2 = await request.post("/validate-rule")
    .send({
        "data": {
            "name": "James Holden",
            "crew": "Rocinante",
            "age": 34,
            "position": "Captain",
            "missions": 45
          },
          "rule":{
            "field":null,
            "condition": GTE,
            "condition_value": 30
          }
    })
    .set("Accept", "application/json");
    expect(response2.body.message).toBe(MISSING_FROM_RULE("field"));
    expect(response2.body.data).toBe(null);
    expect(response2.body.status).toBe(ERROR);
    expect(response2.status).toBe(400);
    done();
  });

  
it("should respond with error message for missing property in rule - condition ", async (done) => {
    const response = await request.post("/validate-rule")
    .send({
        "data": {
            "name": "James Holden",
            "crew": "Rocinante",
            "age": 34,
            "position": "Captain",
            "missions": 45
          },
          "rule":{
            "field": "missions",
            "condition_value": 30
          }
    })
    .set("Accept", "application/json");
    expect(response.body.message).toBe(MISSING_FROM_RULE("condition"));
    expect(response.body.data).toBe(null);
    expect(response.body.status).toBe(ERROR);
    expect(response.status).toBe(400);

    //When null is passed
    const response2 = await request.post("/validate-rule")
    .send({
        "data": {
            "name": "James Holden",
            "crew": "Rocinante",
            "age": 34,
            "position": "Captain",
            "missions": 45
          },
          "rule":{
            "field": "missions",
            "condition": null,
            "condition_value": 30
          }
    })
    .set("Accept", "application/json");
    expect(response2.body.message).toBe(MISSING_FROM_RULE("condition"));
    expect(response2.body.data).toBe(null);
    expect(response2.body.status).toBe(ERROR);
    expect(response2.status).toBe(400);
    done();
  });

  
it("should respond with error message for missing property in rule - condition_value ", async (done) => {
    const response = await request.post("/validate-rule")
    .send({
        "data": {
            "name": "James Holden",
            "crew": "Rocinante",
            "age": 34,
            "position": "Captain",
            "missions": 45
          },
          "rule":{
            "field": "missions",
            "condition": GTE
          }
    })
    .set("Accept", "application/json");
    expect(response.body.message).toBe(MISSING_FROM_RULE("condition_value"));
    expect(response.body.data).toBe(null);
    expect(response.body.status).toBe(ERROR);
    expect(response.status).toBe(400);

    //When null is passed
    const response2 = await request.post("/validate-rule")
    .send({
        "data": {
            "name": "James Holden",
            "crew": "Rocinante",
            "age": 34,
            "position": "Captain",
            "missions": 45
          },
          "rule":{
            "field": "missions",
            "condition": GTE,
            "condition_value": null
          }
    })
    .set("Accept", "application/json");
    expect(response2.body.message).toBe(MISSING_FROM_RULE("condition_value"));
    expect(response2.body.data).toBe(null);
    expect(response2.body.status).toBe(ERROR);
    expect(response2.status).toBe(400);
    done();
  });


  //Advanced test
  describe("validate when data is an Array", () => {
    it("should respond with HTTP 200 for valid input and passed validation", async (done) => {
    const data =  {
        "rule": {
            "field": "2",
            "condition": CONTAINS,
            "condition_value":"ff"
          },
          "data": ["eeee","dddd","ffff","gggg"]
    };
    const response = await request.post("/validate-rule")
    .send(data)
    .set("Accept", "application/json");

    expect(response.body.message).toBe(FIELD_VAL_SUCC(data.rule.field));
    expect(response.body.status).toBe(SUCCESS);
   
    expect(response.body.data.validation.error).toBe(false);
    expect(response.body.data.validation.field).toBe(data.rule.field);
    expect(response.body.data.validation.field_value).toBe(data.data[data.rule.field]);
    expect(response.body.data.validation.condition).toBe(data.rule.condition);
    expect(response.body.data.validation.condition_value).toBe(data.rule.condition_value);

    expect(response.status).toBe(200);
    done();
    });

    it("should respond with HTTP 400 for missing field in data", async (done) => {
        const data =  {
            "rule": {
                "field": "5",
                "condition": CONTAINS,
                "condition_value":"ee"
              },
              "data": ["eeee","dddd","ffff","gggg"]
        };
        const response = await request.post("/validate-rule")
        .send(data)
        .set("Accept", "application/json");
    
        expect(response.body.message).toBe(MISSING_FROM_DATA(data.rule.field));
        expect(response.body.data).toBe(null);
        expect(response.body.status).toBe(ERROR);
        expect(response.status).toBe(400);
        done();
        });
        
    it("should respond with HTTP 400 for missing field in data", async (done) => {
        const data =  {
            "rule": {
                "field": "missions.stage",
                "condition": CONTAINS,
                "condition_value":"ee"
              },
              "data": ["eeee","dddd","ffff","gggg"]
        };
        const response = await request.post("/validate-rule")
        .send(data)
        .set("Accept", "application/json");
    
        expect(response.body.message).toBe(MISSING_FROM_DATA(data.rule.field));
        expect(response.body.data).toBe(null);
        expect(response.body.status).toBe(ERROR);
        expect(response.status).toBe(400);
        done();
        });

        
    it("should respond with HTTP 400 for missing field in data", async (done) => {
        const data =  {
            "rule": {
                "field": "missions",
                "condition": CONTAINS,
                "condition_value":"ee"
              },
              "data": []
        };
        const response = await request.post("/validate-rule")
        .send(data)
        .set("Accept", "application/json");
    
        expect(response.body.message).toBe(MISSING_FROM_DATA(data.rule.field));
        expect(response.body.data).toBe(null);
        expect(response.body.status).toBe(ERROR);
        expect(response.status).toBe(400);
        done();
        });
});

describe("validate when data is an String", () => {
    it("should respond with HTTP 200 for passed validation", async (done) => {
    const data =  {
        "rule": {
            "field": "0",
            "condition": EQ,
            "condition_value":"e"
          },
          "data": "efgh"
    };
    const response = await request.post("/validate-rule")
    .send(data)
    .set("Accept", "application/json");

    expect(response.body.message).toBe(FIELD_VAL_SUCC(data.rule.field));
    expect(response.body.status).toBe(SUCCESS);
   
    expect(response.body.data.validation.error).toBe(false);
    expect(response.body.data.validation.field).toBe(data.rule.field);
    expect(response.body.data.validation.field_value).toBe(data.data[data.rule.field]);
    expect(response.body.data.validation.condition).toBe(data.rule.condition);
    expect(response.body.data.validation.condition_value).toBe(data.rule.condition_value);

    expect(response.status).toBe(200);
    done();
    });

    it("should respond with HTTP 400 for failed validation", async (done) => {
        const data =  {
            "rule": {
                "field": "0",
                "condition": EQ,
                "condition_value":"f"
              },
              "data": "efgh"
        };
        const response = await request.post("/validate-rule")
        .send(data)
        .set("Accept", "application/json");
    
        expect(response.body.message).toBe(FIELD_VAL_FAIL(data.rule.field));
        expect(response.body.status).toBe(ERROR);
       
        expect(response.body.data.validation.error).toBe(true);
        expect(response.body.data.validation.field).toBe(data.rule.field);
        expect(response.body.data.validation.field_value).toBe(data.data[data.rule.field]);
        expect(response.body.data.validation.condition).toBe(data.rule.condition);
        expect(response.body.data.validation.condition_value).toBe(data.rule.condition_value);
    
        expect(response.status).toBe(400);
        done();
        });

    it("should respond with HTTP 400 for missing field in data", async (done) => {
        const data =  {
            "rule": {
                "field": "5",
                "condition": EQ,
                "condition_value":"e"
              },
              "data": "efgh"
        };
        const response = await request.post("/validate-rule")
        .send(data)
        .set("Accept", "application/json");
    
        expect(response.body.message).toBe(MISSING_FROM_DATA(data.rule.field));
        expect(response.body.data).toBe(null);
        expect(response.body.status).toBe(ERROR);
        expect(response.status).toBe(400);
        done();
        });
});

describe("validate when data is an Object", () => {
    it("should respond with HTTP 400 for missing field in data", async (done) => {
    const data =  {
        "rule": {
            "field": "job",
            "condition": EQ,
            "condition_value":"e"
          },
          "data": data2.data
    };
    const response = await request.post("/validate-rule")
    .send(data)
    .set("Accept", "application/json");

    expect(response.body.message).toBe(MISSING_FROM_DATA(data.rule.field));
    expect(response.body.data).toBe(null);
    expect(response.body.status).toBe(ERROR);
    expect(response.status).toBe(400);
    done();
    });

    it("should respond with HTTP 400 for failed validation", async (done) => {
        const data =  {
            "rule": {
                "field": "missions",
                "condition": GTE,
                "condition_value":54
              },
              "data": data2.data
        };
        const response = await request.post("/validate-rule")
        .send(data)
        .set("Accept", "application/json");
    
        expect(response.body.message).toBe(FIELD_VAL_FAIL(data.rule.field));
        expect(response.body.status).toBe(ERROR);
       
        expect(response.body.data.validation.error).toBe(true);
        expect(response.body.data.validation.field).toBe(data.rule.field);
        expect(response.body.data.validation.field_value).toBe(data.data[data.rule.field]);
        expect(response.body.data.validation.condition).toBe(data.rule.condition);
        expect(response.body.data.validation.condition_value).toBe(data.rule.condition_value);
    
        expect(response.status).toBe(400);
        done();
        });

        
    it("should respond with HTTP 400 for missing field in data", async (done) => {
        const data =  {
            "rule": {
                "field": "missions.stage",
                "condition": GT,
                "condition_value":45
              },
              "data": {
                "name": "James Holden",
                "crew": "Rocinante",
                "age": 34,
                "position": "Captain",
                "missions": 45
              }
        };
        const response = await request.post("/validate-rule")
        .send(data)
        .set("Accept", "application/json");
    
        
        expect(response.body.message).toBe(MISSING_FROM_DATA(data.rule.field));
        expect(response.body.data).toBe(null);
        expect(response.body.status).toBe(ERROR);
        expect(response.status).toBe(400);
        done();
        });

        it("should respond with HTTP 200 for valid input and passed validation", async (done) => {
            const data =  {
                "rule": {
                    "field": "missions.stage.round",
                    "condition":  NEQ,
                    "condition_value":45
                  },
                  "data": {
                    "name": "James Holden",
                    "crew": "Rocinante",
                    "age": 34,
                    "position": "Captain",
                    "missions": {
                        "stage":{
                            "round": 34
                        }
                    }
                  }
            };
            const response = await request.post("/validate-rule")
            .send(data)
            .set("Accept", "application/json");
        
            expect(response.body.message).toBe(FIELD_VAL_SUCC(data.rule.field));
            expect(response.body.status).toBe(SUCCESS);
        
            expect(response.body.data.validation.error).toBe(false);
            expect(response.body.data.validation.field).toBe(data1.rule.field);
            expect(response.body.data.validation.field_value).toBe(data1.data[data1.rule.field]);
            expect(response.body.data.validation.condition).toBe(data1.rule.condition);
            expect(response.body.data.validation.condition_value).toBe(data1.rule.condition_value);

            expect(response.status).toBe(200);
            done();
            });

});

it("should respond with HTTP 400 for more than 2 nested level in field", async (done) => {
    const data =  {
        "rule": {
            "field": "missions.stage.round.door",
            "condition": NEQ,
            "condition_value":"e"
          },
          "data": data2.data
    };
    const response = await request.post("/validate-rule")
    .send(data)
    .set("Accept", "application/json");

    expect(response.body.message).toBe(TOO_MUCH_NESTING(data.rule.field));
    expect(response.body.data).toBe(null);
    expect(response.body.status).toBe(ERROR);
    expect(response.status).toBe(400);
    done();
    });

    it("should respond with HTTP 400 for more than 2 nested level in field", async (done) => {
        const data =  {
            "rule": {
                "field": "missions.stage.round.door",
                "condition": NEQ,
                "condition_value":"e"
              },
              "data": data2.data
        };
        const response = await request.post("/validate-rule")
        .send(data)
        .set("Accept", "application/json");
    
        expect(response.body.message).toBe(TOO_MUCH_NESTING(data.rule.field));
        expect(response.body.data).toBe(null);
        expect(response.body.status).toBe(ERROR);
        expect(response.status).toBe(400);
        done();
        });

        it("should respond with HTTP 400 if invalid condition is passed", async (done) => {
            const data =  {
                "rule": {
                    "field": "missions.stage.round.door",
                    "condition": "lte",
                    "condition_value":23
                  },
                  "data": data2.data
            };
            const response = await request.post("/validate-rule")
            .send(data)
            .set("Accept", "application/json");
        
            expect(response.body.message).toBe(INVALID_PAYLOAD);
            expect(response.body.data).toBe(null);
            expect(response.body.status).toBe(ERROR);
            expect(response.status).toBe(400);
            done();
            });

            // When data is an array
//  string not found,doublestring nor found(array has values)
// string(number) not found(empty array)

// When data is string
// string(number) equal(found),string not found, string not equal 

//When data is object
//string not found, one level not found(fails val), one level not found, two level found(pass val) 
  
//error when more than two level in field

//neq,gt,gte array,contains(1 pass, 1 fail)

//end
});
  
