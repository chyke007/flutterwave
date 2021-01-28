// eslint-disable-next-line no-unused-vars
import { Response, Request, NextFunction } from "express";
import { NAME, EMAIL, GITHUB, MOBILE} from "../../config";
import { GET_MESSAGE,SUCCESS } from "../utils";

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
    const details = {
        message: GET_MESSAGE,
        status: SUCCESS,
        data:{

            "nasme": NAME,
            "github": GITHUB,
            "email": EMAIL,
            "mobile": MOBILE
        }
    };
  handleResult(details, res, next);
    
  };
  
export { get,validate };
