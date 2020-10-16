/// Util Functions for Arrays


/**
 * Returns a random value from the aray
 * @function sampleArray
 * @param {Array} arr the input array
 * @returns {any} whatever datatypes the array contains
 */

 export function sampleArray(arr: Array<any>): any{

    return arr[Math.floor(Math.random() * arr.length)];

 }