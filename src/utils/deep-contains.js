/**
 * Deep contains a doubly nested array (no more, didn't want to generalize)
 * at most, does arr[0][0]
 *
 * @param {array} source - Object to be checked that it contains @param value. (***Must be at most two deep***)
 * @param {primitive} value - value to be found in source
 * @return {object} Cloned `source` object.
 */
const deepContains = (source, value) => {
  for(let item of source){
    if(Array.isArray(item)){
      if(item.includes(value)){
        return true;
      }
    }
    else {
      if (item == value) {
        return true;
      }   
    }
  }
  return false;
};

export default deepContains;
