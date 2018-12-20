//#region utils
function clampNumber(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b))
}
function randomInt(min, max) {
    const lowerLimit = Math.ceil(min)
    const upperLimit = Math.floor(max)
    const range = upperLimit - lowerLimit + 1
    return Math.floor(Math.random() * range) + lowerLimit
}
function sample(arr) {
    const index = randomInt(0, arr.length - 1)
    return arr[index]
}
function rectInScreen(screen, { x, y, width, height }) {
    const xIn = x > 0 && x + width < screen.width
    const yIn = y + height > 0 && y > screen.height
    return !(xIn && yIn)
}
function getRect({ x = 0, y = 0, width = 0, height = 0 }) {
    const initial = { x, y, width, height, vx: 0, vy: 0 }
    return { ...initial, initial }
}
function getScreen({ width = 0, height = 0 }) {
    return { width, height }
}
function getSanta(screen) {
    const rect = getRect({
        x: screen.width / 100,
        y: screen.height / 2,
        height: 72,
        width: 120,
    })
    return { ...rect, speed: 4 }
}
function collisionDetected(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    )
}
const presentImg = new Image()
presentImg.src = './present1.png'
const presentImg2 = new Image()
presentImg2.src = './present2.png'
const presentImg3 = new Image()
presentImg3.src = './present3.png'
function getPresentImage() {
    return sample([presentImg, presentImg2, presentImg3])
}
function getPresent() {
    const img = getPresentImage()
    const rect = getRect({
        x: randomInt(SCREEN.width, SCREEN.width * 2),
        y: randomInt(0, SCREEN.height),
        width: img.width,
        height: img.height,
    })
    return { ...rect, speed: randomInt(2, 5), img }
}
//#endregion

//#region keyboard
const KEYS = {}

window.addEventListener('keydown', keyDownHandler, false)
window.addEventListener('keyup', keyUpHandler, false)
function keyUpHandler({ key }) {
    KEYS[key] = false
}
function keyDownHandler({ key }) {
    KEYS[key] = true
}
//#endregion

//#region globals
const CANVAS = document.getElementById('santa-game')
const CTX = CANVAS.getContext('2d')
const FRICTION = 0.97
const SCREEN = getScreen({
    width: (CANVAS.width = 640),
    height: (CANVAS.height = 420),
})
const SANTA = getSanta(SCREEN)
const PRESENTS = []
const PRESENT_COUNT = 8
function generatePresents() {
    for (let i = 0; i < PRESENT_COUNT; ++i) {
        PRESENTS.push(getPresent())
    }
}

//#endregion

//#region render
const img = new Image()
img.src = './santa.png'
function renderRectAsSanta(ctx, rect) {
    ctx.save()
    ctx.translate(rect.x, rect.y)
    ctx.drawImage(img, 0, 0, rect.width, rect.height)
    ctx.restore()
}

function renderRectAsPresent(ctx, rect) {
    ctx.save()
    ctx.translate(rect.x, rect.y)
    ctx.drawImage(rect.img, 0, 0, rect.width, rect.height)
    ctx.restore()
}
//#endregion

//#region update
function updateSanta(screen, santa) {
    if (KEYS['w'] || KEYS['ArrowUp']) santa.vy = -santa.speed
    if (KEYS['s'] || KEYS['ArrowDown']) santa.vy = santa.speed
    if (KEYS['a'] || KEYS['ArrowLeft']) santa.vx = -santa.speed
    if (KEYS['d'] || KEYS['ArrowRight']) santa.vx = santa.speed

    santa.x += santa.vx
    santa.y += santa.vy

    if (santa.vx) santa.vx *= FRICTION
    if (santa.vy) santa.vy *= FRICTION

    santa.x = clampNumber(santa.x, 0, screen.width - santa.width)
    santa.y = clampNumber(santa.y, 0, screen.height - santa.height)
}
//#endregion

//#region gameLoop
function gameLoop(ctx, screen) {
    requestAnimationFrame(gameLoop.bind(null, ctx, screen))

    ctx.clearRect(0, 0, screen.width, screen.height)

    updateSanta(screen, SANTA)
    renderRectAsSanta(ctx, SANTA)

    PRESENTS.forEach(rect => {
        rect.x -= 4

        if (collisionDetected(rect, SANTA) || !rectInScreen(SCREEN, rect)) {
            Object.assign(rect, getPresent())
        }
    })
    PRESENTS.forEach(rect => {
        if (rectInScreen(SCREEN, rect)) renderRectAsPresent(ctx, rect)
    })
}

generatePresents()
gameLoop(CTX, SCREEN)
//#endregion
