export default function former(hash = {}) {
    const data = new FormData()
    for (let key in hash) {
        data.append(key, hash[key])
    }
    return data
}
