// eslint-disable-next-line no-unused-vars
import { Response, Request, NextFunction } from "express";
import { NAME, EMAIL, GITHUB, MOBILE} from "../../config";
import {CONTAINS, ERROR, EQ,FIELD_VAL_FAIL, FIELD_VAL_SUCC,FIELD_REQ,GET_MESSAGE,GT, GTE, INVALID_DATA,INVALID_PAYLOAD,INVALID_RULE,MISSING_FROM_DATA,MISSING_FROM_RULE,NEQ, SUCCESS, TOO_MUCH_NESTING } from "../../server/utils";


type dataType = string | any | Array<any>;

const recurser = (field:any, data: dataType) : any => {
    
      if(data == null){
        return undefined;
      }
    //   console.log(field,data);
      if (typeof field == "string")
          return recurser(field.split("."),data);
      else if (field.length==0)
          return data;
      else
          return recurser(field.slice(1),data[field[0]] || null);
};
const validateRule = (field:string,condition:string,condition_value:string,data:dataType) : boolean => {
    let valid = false;

    switch(condition){
        case CONTAINS:
          valid = (recurser(field,data).includes(condition_value));
        break;
        case EQ:
          valid = (recurser(field,data) == condition_value);
        break;
       
        case GTE:
          valid = (recurser(field,data) >= condition_value);
        break;

        case GT:
          valid = (recurser(field,data) > condition_value);
        break;
        case NEQ:
            valid = (recurser(field,data) != condition_value);
          break;
  
      }

    return valid;
};

const CustomResult = (message:string,rule:Record<string, unknown>, field_value:string,status: boolean) => {
    return  {
        message,
        status:status ? ERROR : SUCCESS,
        data: {
            validation: {
                error: status,
                field_value: field_value,
                ...rule
            }
        }
      };
};

interface CustomEx {
    message: string,
    status: string,
    data: any
}
/**
 * Send error payload to user
 * @param  {string} string
 */
const CustomException = (message:string): CustomEx => {
   return  {
        message,
        status: ERROR,
        data: null
      };

};

type rule = {
    data: Record<string, unknown>;
    message: string,
    status: string
}
/**
 * Send result to user
 * @param  {object} rule
 * @param  {Response} res
 * @param {function} next
 */
const handleResult = function (rule:rule, res:Response, next:NextFunction) {
    if (rule) {
      res.json({
          message:rule.message,
          status:rule.status,
          data: rule.data
        });
    } else {
      res.status(404);
      next( );
    }
  };
  
/* eslint func-names: ["error", "never"] */
/**
 * @param  {Request} req
 * @param  {Response} res
 * @param  {NextFunction} next
 */
const get = async function (req:Request, res:Response, next:NextFunction) {
    const details = {
        message: GET_MESSAGE,
        status: SUCCESS,
        data:{

            "name": NAME,
            "github": GITHUB,
            "email": EMAIL,
            "mobile": MOBILE
        }
    };
  handleResult(details, res, next);
};

/* eslint func-names: ["error", "never"] */
/**
 * @param  {Request} req
 * @param  {Response} res
 * @param  {NextFunction} next
 */
const validate = async function (req:Request, res:Response, next:NextFunction) {
    const { body } = req;
    // console.log(body);
    if (!("rule" in body) && !("data" in body)) {
        res.status(400);
        return res.json(CustomException(INVALID_PAYLOAD));
    }

    if (!("rule" in body) || !("data" in body) || (body.rule === null) || (body.data === null)) {
        res.status(400);
        return res.json(CustomException(FIELD_REQ(body.rule ? "data": "rule")));
    }

    //Invalid rule
    if (typeof body.rule !== "object") {
        res.status(400);
        return res.json(CustomException(INVALID_RULE));
    }

    //Invalid data
    if (!(typeof body.data === "object" || typeof body.data === "string")) {
        res.status(400);
        return res.json(CustomException(INVALID_DATA));
    }

    if (!("field" in body.rule) || !("condition" in body.rule) || !("condition_value" in body.rule) || (body.rule.field === null) || (body.rule.condition === null) || (body.rule.condition_value === null)) {
        res.status(400);
        return res.json(CustomException(MISSING_FROM_RULE(body.rule.field ? body.rule.condition ? "condition_value" :"condition": "field")));
    }


    if(typeof body.rule.field == "string" && (body.rule.field.match(/\./g) || []).length > 2){
        res.status(400);
        return res.json(CustomException(TOO_MUCH_NESTING(body.rule.field)));
    }

    //Verifies condition payload
    if (!(body.rule.condition === EQ || body.rule.condition === NEQ || body.rule.condition === GT || body.rule.condition === GTE || body.rule.condition === CONTAINS)) {
        res.status(400);
        return res.json(CustomException(INVALID_PAYLOAD));
    }

    
    //Missing field
    if (!recurser(body.rule.field,body.data)) {
        res.status(400);
        return res.json(CustomException(MISSING_FROM_DATA(body.rule.field)));
    }


    if(!validateRule(body.rule.field,body.rule.condition,body.rule.condition_value,body.data)){
        res.status(400);
        return res.json(CustomResult(FIELD_VAL_FAIL(body.rule.field),body.rule,recurser(body.rule.field,body.data),true));
    }
    return res.json(CustomResult(FIELD_VAL_SUCC(body.rule.field),body.rule,recurser(body.rule.field,body.data),false));

  };
  
export { get,validate };
