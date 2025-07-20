import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'

const hashes = (await readFile('hashes.txt', { encoding: 'utf-8' })).split(
    /\r?\n/
)

const dictionaries = (
    await readFile('dictionary.txt', { encoding: 'utf-8' })
).split(/\r?\n/)

for (const hash of hashes) {
    for (const pw of dictionaries) {
        if (createHash('sha256').update(pw).digest('hex') === hash)
            console.log(pw)
    }
}
