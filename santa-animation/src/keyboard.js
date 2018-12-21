export const KEYS = {}

window.addEventListener('keydown', keyDownHandler, false)
window.addEventListener('keyup', keyUpHandler, false)

function keyUpHandler({ key }) {
    KEYS[key] = false
}

function keyDownHandler({ key }) {
    KEYS[key] = true
}
