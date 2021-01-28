import { Response, NextFunction } from "express";
import {CONTAINS, ERROR, EQ,GT, GTE,NEQ, SUCCESS } from "../../server/utils";

//Types
export type dataType = string | any | Array<any>;
export type objectType = Record<string, unknown>;

export type rule = {
    data: objectType
    message: string,
    status: string
}

//Interfaces

export interface CustomEx {
    message: string,
    status: string,
    data: any
}

//Methods

/**
 * Recursive method used for seeking value in data
 * @param  {any} field
 * @param  {dataType} data
 */

export const recurser = (field:any, data: dataType) : any => {
      if(data == null){
        return undefined;
      }
      if (typeof field == "string")
          return recurser(field.split("."),data);
      else if (field.length==0)
          return data;
      else
          return recurser(field.slice(1),data[field[0]] || null);
};

/**
 * Validates condition
 * @param  {String} field
 * @param  {String} condition
 * @param  {String} condition_value
 * @param  {dataType} data
 * @return {Boolean}
 */
export const validateRule = (field:string,condition:string,condition_value:string,data:dataType) : boolean => {
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


/**
 * Customizes message payload to send once value is found
 * @param  {String} message
 * @param  {objectType} rule
 * @param  {String} field_value
 * @param  {Boolean} status
 * @return {Object}
 */
export const customResult = (message:string,rule:objectType, field_value:string,status: boolean) => {
    return  {
        message,
        status:status ? ERROR : SUCCESS,
        data: {
            validation: {
                error: status,
                field: rule.field,
                field_value,
                condition: rule.condition,
                condition_value: rule.condition_value
            }
        }
      };
};
/**
 * Send error payload to user
 * @param  {string} message
 * @return {Object}
 */
export const customException = (message:string): CustomEx => {
   return  {
        message,
        status: ERROR,
        data: null
      };

};

/**
 * Send result to user
 * @param  {object} rule
 * @param  {Response} res
 * @param {function} next
 */
export const handleResult = function (rule:rule, res:Response, next:NextFunction) {
      res.json({
          message:rule.message,
          status:rule.status,
          data: rule.data
        });
  };
  
