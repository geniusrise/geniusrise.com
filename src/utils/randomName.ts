function capFirst(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min
}

function generateName() {
    return Array.from({ length: 10 }, () => getRandomInt(0, 10)).join("")
}

export { generateName }
