//ignore this function, I don't think it's working right

export function isPrimitive (val) {
    // typeof null returns object but for this null is a primitive
    return val === null || ["object","function"].indexOf(typeof val) === -1;
}

export function findPrimitives (obj, callback, propName, path = []) {
    var keys, name;                  
    if(typeof callback !== "function"){
        return undefined;     
    }
    if (typeof obj === "object") {
        keys = Object.keys(obj); 
                                 
    } else {
        if( isPrimitive(obj) ) {
            return callback(obj, propName, path); 
        }
        return false;
    }
    path.push(propName);
    for(name of keys){
        if (isPrimitive(obj[name]) ) {
            if (callback(obj[name], name, path) === true) {  
                return true; 
            }
        } else {
            if (findPrimitives(obj[name], callback, name,  path)) { 
                return true; 
            }
        }
    }
    path.pop();  
    return false;
}

/**
    This method gets the value quantities for any Observation resource, regardless of if its a compound measurement (like BP) or a normal Observation, and does the callback on it

    @param obList: list of observations
    @param id: string to match
    @param callback: function to perform on the matches

    @return transformed matches after callback
**/
export function getValueQuantities(obs, callback){
    //components exist so you have to get the quantities from there and do something with them
    if(obs.component){
        for (let comp of obs.component){
                callback(obs,comp);

        }
        return;
    }
        callback(obs,obs);

}
