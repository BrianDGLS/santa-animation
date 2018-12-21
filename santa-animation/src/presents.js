import { sample, randomInt, inScreen, collisionDetected } from './utils'

async function loadPresentImages() {
    const imageFiles = [
        '/img/present1.png',
        '/img/present2.png',
        '/img/present3.png',
    ]
    const images = imageFiles.map(src => {
        const img = new Image()
        img.src = src
        return img
    })
    const imagePromises = images.map(img => {
        return new Promise(res => {
            img.addEventListener('load', () => res(img))
        })
    })
    return Promise.all(imagePromises)
}

export async function getGetPresent(screen) {
    const images = await loadPresentImages()
    return () => {
        const img = sample(images)
        return {
            img,
            x: randomInt(screen.width, screen.width * 2),
            y: randomInt(img.height, screen.height - img.height),
            width: img.width,
            height: img.height,
            vx: 0,
            vy: 0,
            speed: 2,
        }
    }
}

export function getRenderPresents(presents, ctx) {
    return () => {
        presents.forEach(present => {
            ctx.save()
            ctx.translate(present.x, present.y)
            ctx.drawImage(present.img, 0, 0, present.width, present.height)
            ctx.restore()
        })
    }
}

export function getUpdatePresents(presents, screen, santa) {
    return () => {
        presents
            .filter(present => inScreen(screen, present))
            .forEach(present => {
                present.x -= present.speed

                const leftScreen = present.x + present.width < 0
                const hitSanta = collisionDetected(present, santa)

                if (leftScreen || hitSanta) {
                    present.x = randomInt(screen.width, screen.width * 2)
                    present.y = randomInt(
                        present.height,
                        screen.height - present.height,
                    )
                }

                if(hitSanta) {
                    santa.score++
                }
            })
    }
}
