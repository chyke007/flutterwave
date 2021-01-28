// eslint-disable-next-line no-unused-vars
import { Response, Request, NextFunction } from "express";
import { NAME, EMAIL, GITHUB, MOBILE} from "../../config";
import {CONTAINS, ERROR, EQ,FIELD_VAL_FAIL, FIELD_VAL_SUCC,FIELD_REQ,GET_MESSAGE,GT, GTE, INVALID_DATA,INVALID_PAYLOAD,INVALID_RULE,MISSING_FROM_DATA,MISSING_FROM_RULE,NEQ, SUCCESS, TOO_MUCH_NESTING } from "../../server/utils";


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
    
    if (!("rule" in body) && !("data" in body)) {
        res.status(400);
        return res.json(CustomException(INVALID_PAYLOAD));
    }

    if (!("rule" in body) || !("data" in body) || (body.rule === null) || (body.data === null)) {
        res.status(400);
        return res.json(CustomException(FIELD_REQ(body.rule ? "data": "rule")));
    }

    //Invalid rule

    //Invalid data
    
  };
  
export { get,validate };
