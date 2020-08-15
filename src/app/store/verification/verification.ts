const BOOLEAN = 'boolean';
const STRING = 'string';
const NUMBER = 'number';
const UNDEFINED = 'undefined';
const OBJECT = 'object';
const FUNCTION = 'function';

export const isNull = (prop) => typeof prop === OBJECT && !prop;
export const isObject = (prop) => typeof prop === OBJECT && prop;
export const isArray = (prop) => isObject(prop) && Array.isArray(prop);



export const isBoolean = (prop) => typeof prop === BOOLEAN;
export const isString = (prop) => typeof prop === STRING;
export const isNumber = (prop) => typeof prop === NUMBER;
export const isUndefined = (prop) => typeof prop === UNDEFINED;
export const isFunction = (prop) => typeof prop === FUNCTION;

// takes multiple verifiers e.g isObject, isNull and runs the prop through each of them until it finds a valid one or runs out of verifiers
export const isOneOf = (...verifiers) => {
  return (prop) => {
    for(let verifier of verifiers){
      if(verifier(prop)){
        return true
      }
    }
    return false;
  }
};

// used for verifying the structure of an object
export const hasShape = (typeObj) => {
  return (prop) => {
    if(!isObject(prop)){
      return false;
    }
    return createVerificationObject(typeObj, prop);
  }
}

export const isArrayOf = (verifier) => {
  return (prop) => {
    if(!isArray(prop)){
      return false
    }
    // if array has elements in it, return an array of verificationResults
    if(prop.length > 0){
      return prop.map(val => verifier(val))
    }
    // if the array is empty, assume everything is good to go
    return true
  }
}

export function createVerificationObject(typeObj, verifyObj){
  let typeCheckObj = {};
  const typeObjKeys = Object.keys(typeObj);
  const verifyObjKeys = Object.keys(typeObj);

  // keys that are in both typeObj and verifyObj
  const encompassedKeys = typeObjKeys.filter(key => verifyObj[key] !== undefined);
  // keys that are in typeObj but not verifyObj
  const missingTypeObjKeys = typeObjKeys.filter(key => verifyObj[key] === undefined);
  // keys that are in verifyObj but not typeObj
  const missingVerifyObjKeys = verifyObjKeys.filter(key => typeObj[key] === undefined);
  

  for(let key of encompassedKeys){
    const typeVerifier = typeObj[key];
    
    const prop = verifyObj[key];
    
    typeCheckObj[key] = typeVerifier(prop);
  }

  return {
    typeCheckObj,
    missingTypeObjKeys,
    missingVerifyObjKeys
  }
}

export const validateStrict = (verificationObject) => {
  // dont like how arrays of boolean values are handled, but it works for the moment
  if(isArray(verificationObject)){
    verificationObject.forEach(val => validateStrict(val));
  }
  else if(isObject(verificationObject)){
    if(verificationObject.missingTypeObjKeys.length > 0 || verificationObject.missingVerifyObjKeys.length > 0){
      console.log(verificationObject.missingTypeObjKeys, verificationObject.missingVerifyObjKeys)
      throw new Error('Passed Object and Type Object properties do not match');
    }
  
    for(let prop in verificationObject.typeCheckObj){
      let typeCheckValue = verificationObject.typeCheckObj[prop];
      
      if(isObject(typeCheckValue)){
          validateStrict(typeCheckValue);
      }
      if(!typeCheckValue){
        throw new Error(`Type validation failed on property ${prop}.`);
      }
    }  
  }
  else if(isBoolean(verificationObject) && !verificationObject){
    throw new Error('Type validation failed.')
  }

  
  return true;
}