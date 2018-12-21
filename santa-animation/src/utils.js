export function copyObj(obj) {
    return Object.assign({}, obj)
}

export function clampNumber(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b))
}

export function randomInt(min, max) {
    const lowerLimit = Math.ceil(min)
    const upperLimit = Math.floor(max)
    const range = upperLimit - lowerLimit + 1
    return Math.floor(Math.random() * range) + lowerLimit
}

export function sample(arr) {
    const index = randomInt(0, arr.length - 1)
    return arr[index]
}

export function collisionDetected(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    )
}

export function inScreen(screen, { x, y, width, height }) {
    const xIn = x > 0 && x + width < screen.width
    const yIn = y + height > 0 && y > screen.height
    return !(xIn && yIn)
}
