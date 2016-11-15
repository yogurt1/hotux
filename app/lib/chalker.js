import chalk from 'chalk'

export default function createChalcker(...opts) {
    let chalker = chalk

    if (opts.length) {
        for (let opt of opts) {
            chalker = chalker[opt]
        }
    }

    return chalker
}
