type GameTile = 'x' | '' | 'b' | 'g'
type GameState = GameTile[][]
type Transformation = (initial: GameState) => GameState | boolean

const level: GameState = [
    ['b', 'g', 'x', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['b', 'g', '', '', '']
]

console.log('Board:', level)

const moveLeft: Transformation = (initial) => {
    const newState: GameState = []
    let greensLeft = false
    for (const [rowIndex, row] of initial.entries()) {
        const movables: number[] = row
            .map((a, index) => (a !== 'x' ? index : null))
            .filter((a) => a !== null)

        // Find continguous sections where there are no blockers
        type Section = [number, number]
        const sections: Section[] = movables.reduce((acc, val) => {
            for (const [index, interval] of acc.entries()) {
                // Check if the value is already in an existing interval
                if (interval[0] <= val && val <= interval[1]) return acc

                // Check if the value could be included in an existing interval

                // this one shouldnt ever occur but better safe than sorry
                if (interval[0] - 1 === val) {
                    acc[index] = [val, interval[1]]
                    return acc
                }

                if (interval[1] + 1 === val) {
                    acc[index] = [interval[0], val]
                    return acc
                }
            }
            acc.push([val, val])
            return acc
        }, [] as Section[])

        // Check in each section and move all game pieces to the left.
        // Modify the row with the changes.
        // Row index 2 is handled differently. If it's row index 2 and the interval contains 2,
        // then check if any blue or green pieces enter the hole. If a blue piece enters, then
        // return false no matter what. Otherwise if a green piece enters, then return true.
        const newRow = [...row]
        for (const section of sections) {
            if (rowIndex === 2 && section[0] <= 2 && 2 <= section[1]) {
                // Check the number of green and blue pieces to the left of the hole
                const [green, blue] = newRow.slice(section[0], 3).reduce(
                    (acc, val) => {
                        if (val === 'g') acc[0]++
                        if (val === 'b') acc[1]++
                        return acc
                    },
                    [0, 0]
                )

                // Then perform the row operation
                newRow.splice(
                    section[0],
                    section[1] - section[0] + 1,
                    ...newRow
                        .slice(section[0], section[1] + 1)
                        .sort((a, b) => b.length - a.length)
                )

                // Check if the number of green and blue pieces changes
                // If blue does, then false
                const [newGreen, newBlue] = newRow.slice(section[0], 3).reduce(
                    (acc, val) => {
                        if (val === 'g') acc[0]++
                        if (val === 'b') acc[1]++
                        return acc
                    },
                    [0, 0]
                )

                if (newBlue !== blue) return false
                // If green does, then remove the new green ones
                if (newGreen !== green) {
                    let difference = green
                    for (const i of Array(3).keys()) {
                        if (difference <= 0 && newRow[i] === 'g') newRow[i] = ''
                        else if (newRow[i] === 'g') difference--
                    }
                }
            } else {
                newRow.splice(
                    section[0],
                    section[1] - section[0] + 1,
                    ...newRow
                        .slice(section[0], section[1] + 1)
                        .sort((a, b) => b.length - a.length)
                )
            }
        }
        if (newRow.includes('g')) greensLeft = true
        newState.push(newRow)
    }
    if (greensLeft) return newState
    return true
}

const moveRight: Transformation = (initial) => {
    const result = moveLeft(initial.map((row) => row.toReversed()))
    return typeof result === 'boolean'
        ? result
        : result.map((row) => row.toReversed())
}

const moveUp: Transformation = (initial) => {
    const transform = (start: GameState): GameState =>
        // create new array where the xth element of every yth array is
        // mapped to the yth element of every xth array
        start.reduce(
            (acc, val, index) => {
                val.forEach((tile, tileIndex) => {
                    acc[tileIndex][index] = tile
                })
                return acc
            },
            Array.from({ length: 5 }, () => new Array(5))
        )
    const result = moveLeft(transform(initial))
    return typeof result === 'boolean' ? result : transform(result)
}

const moveDown: Transformation = (initial) => {
    const result = moveUp(initial.toReversed())
    return typeof result === 'boolean' ? result : result.toReversed()
}

// console.log(moveLeft(level))
// console.log(moveRight(level))
// console.log(moveUp(level))
// console.log(moveDown(level))

type Directions = 'left' | 'right' | 'up' | 'down'
const transforms: Record<Directions, Transformation> = {
    left: moveLeft,
    right: moveRight,
    up: moveUp,
    down: moveDown
}
const maxDepth = 1000
const search = (
    initial: GameState | boolean,
    depth: number,
    path: Directions[] = [],
    visited: Set<string> = new Set<string>()
): Directions[] | null => {
    // given the initial state, loop through the four transformations
    // and call the search function recursively on each of them, decreasing the depth by 1
    // if the initial state is already visited or is false, then skip it and return null
    // if the initial state is solved, then return the path
    if (depth <= 0) {
        return null
    }
    if (visited.has(JSON.stringify(initial))) {
        return null
    }
    if (initial === false) {
        return null
    }
    if (initial === true) {
        return path
    }

    visited.add(JSON.stringify(initial))

    for (const [direction, transform] of Object.entries(transforms) as [
        Directions,
        Transformation
    ][]) {
        const newState = search(
            transform(initial),
            depth - 1,
            [...path, direction],
            visited
        )
        if (newState) {
            return newState
        }
    }
    return null
}

const answer = (() => {
    for (const depth of Array(maxDepth).keys()) {
        const result = search(level, depth)
        if (result) return result
    }
    return null
})()
console.log('Moves:', answer)

let board: GameState | boolean = level
console.log('initial:', board)
for (const direction of answer!) {
    board = transforms[direction](board as GameState)
    console.log(`${direction}:`, board)
}
