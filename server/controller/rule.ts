// eslint-disable-next-line no-unused-vars
import { Response, Request, NextFunction } from "express";
import { NAME, EMAIL, GITHUB, MOBILE} from "../../config";
import {
    CONTAINS,
    EQ,
    FIELD_VAL_FAIL,
    FIELD_VAL_SUCC,
    FIELD_REQ,
    GET_MESSAGE,
    GT, 
    GTE, 
    INVALID_DATA,
    INVALID_PAYLOAD,
    INVALID_RULE,
    MISSING_FROM_DATA,
    NEQ,
    SUCCESS, 
    TOO_MUCH_NESTING,
    customException,
    customResult,
    handleResult,
    recurser,
    validateRule
} from "../../server/utils";

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
    if (!("rule" in body) && !("data" in body)) {
        res.status(400);
        return res.json(customException(INVALID_PAYLOAD));
    }

    if (!("rule" in body) || !("data" in body) || (body.rule === null) || (body.data === null)) {
        res.status(400);
        return res.json(customException(FIELD_REQ(body.rule ? "data": "rule")));
    }

    //Invalid rule
    if (typeof body.rule !== "object") {
        res.status(400);
        return res.json(customException(INVALID_RULE));
    }

    //Invalid data
    if (!(typeof body.data === "object" || typeof body.data === "string")) {
        res.status(400);
        return res.json(customException(INVALID_DATA));
    }

    if (!("field" in body.rule) || !("condition" in body.rule) || !("condition_value" in body.rule) || (body.rule.field === null) || (body.rule.condition === null) || (body.rule.condition_value === null)) {
        res.status(400);
        return res.json(customException(INVALID_PAYLOAD));
    }


    if(typeof body.rule.field == "string" && (body.rule.field.match(/\./g) || []).length > 2){
        res.status(400);
        return res.json(customException(TOO_MUCH_NESTING(body.rule.field)));
    }

    //Verifies condition payload
    if (!(body.rule.condition === EQ || body.rule.condition === NEQ || body.rule.condition === GT || body.rule.condition === GTE || body.rule.condition === CONTAINS)) {
        res.status(400);
        return res.json(customException(INVALID_PAYLOAD));
    }

    
    //Missing field
    if (!recurser(body.rule.field,body.data)) {
        res.status(400);
        return res.json(customException(MISSING_FROM_DATA(body.rule.field)));
    }


    if(!validateRule(body.rule.field,body.rule.condition,body.rule.condition_value,body.data)){
        res.status(400);
        return res.json(customResult(FIELD_VAL_FAIL(body.rule.field),body.rule,recurser(body.rule.field,body.data),true));
    }
    return res.json(customResult(FIELD_VAL_SUCC(body.rule.field),body.rule,recurser(body.rule.field,body.data),false));

  };
  
export { get,validate };
