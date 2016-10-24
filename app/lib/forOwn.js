/*
 * @param {object} Object to iterate
 * @param {cb} Function to call on every element
 * @returns {array} Array of results of callback
 */
export default function forOwn(object, cb, skipUndefined = true) {
    const array = []
    const keys = Object.keys(object)
    const l = keys.length

    for (let val, i = 0; i < l; i++) {
        value = object[keys[key]]

        if (typeof val !== 'undefined') {
            array.push(cb(val, i))
        }
    }

    return array
}
