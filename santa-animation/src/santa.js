import { KEYS } from './keyboard'
import { clampNumber } from './utils'

const FRICTION = 0.97

export async function getSanta(screen) {
    const img = await getSantaImg()
    const santa = getSantaDefaults(screen, img)
    return santa
}

export function getRenderSanta(santa, ctx) {
    return () => {
        ctx.save()
        ctx.translate(santa.x, santa.y)
        ctx.drawImage(santa.img, 0, 0, santa.width, santa.height)
        ctx.restore()
    }
}

export function getUpdateSanta(santa, screen) {
    return () => {
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
}

function getSantaDefaults(screen, img) {
    return {
        img,
        x: screen.width / 100,
        y: screen.height / 2,
        height: 72,
        width: 120,
        vx: 0,
        vy: 0,
        speed: 4,
        score: 0
    }
}

function getSantaImg() {
    const img = new Image()
    img.src = '/img/santa.png'
    return new Promise(res => img.addEventListener('load', () => res(img)))
}
