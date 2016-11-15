export default async function fetchJson(...args) {
    const res = await fetch(...args)
    const data = await res.json
    return data
}
