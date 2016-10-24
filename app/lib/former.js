/*
 * @param {object} Object
 * @returns {object} FormData
 */
export default function former(object) {
    const form = new FormData()
    for (let key in object) {
        form.append(key, object[key])
    }
    return form
}
