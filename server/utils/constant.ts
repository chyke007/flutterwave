export const SUCCESS = "success";
export const ERROR = "error";
export const EQ = "eq";
export const NEQ = "neq";
export const GT = "gt";
export const GTE = "gte";
export const CONTAINS = "contains";
export const INVALID_PAYLOAD = "Invalid JSON payload passed.";
export const INVALID_RULE = "rule should be an object.";
export const INVALID_DATA = "data should be a valid JSON, Array or String.";
export function FIELD_REQ(field:string){
    return ` ${field} is required.`;
}
export function MISSING_FROM_RULE(field:string){
    return `field ${field} is missing from rule.`;
}
export function MISSING_FROM_DATA(field:string){
    return `field ${field} is missing from data.`;
}
export function FIELD_VAL_SUCC(field:string){
    return `field ${field} successfully validated.`;
}
export function FIELD_VAL_FAIL(field:string){
    return `field ${field} failed validation.`;
}

export function TOO_MUCH_NESTING(field:string){
    return `field ${field} fails the nesting object rule  condition of 2 maximum levels.`;
}

export const GET_MESSAGE = "My Rule-Validation API";
  