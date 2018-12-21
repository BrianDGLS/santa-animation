import { getSetCanvasSize, getGetCTX } from './canvas'
import { getSanta, getUpdateSanta, getRenderSanta } from './santa'
import { getGetPresent, getUpdatePresents, getRenderPresents } from './presents'

const Main = (async function() {
    const SCREEN = { width: 640, height: 420 }

    const CANVAS = document.getElementById('santa-game')
    const setCanvasSize = getSetCanvasSize(CANVAS)
    setCanvasSize(SCREEN.width, SCREEN.height)

    const getCTX = getGetCTX(CANVAS)
    const CTX = getCTX(CANVAS)

    const SANTA = await getSanta(SCREEN)
    const renderSanta = getRenderSanta(SANTA, CTX)
    const updateSanta = getUpdateSanta(SANTA, SCREEN)

    const PRESENT_COUNT = 10
    const PRESENTS = []
    const getPresent = await getGetPresent(SCREEN)
    const renderPresents = getRenderPresents(PRESENTS, CTX)
    const updatePresents = getUpdatePresents(PRESENTS, SCREEN, SANTA)

    for(let i = 0; i < PRESENT_COUNT; ++i) PRESENTS.push(getPresent())
    
    gameLoop(CTX, SCREEN)
    function gameLoop(ctx, screen) {
        requestAnimationFrame(gameLoop.bind(null, ctx, screen))
        ctx.clearRect(0, 0, screen.width, screen.height)

        updateSanta()
        renderSanta()

        updatePresents()
        renderPresents()
    }

    const playButton = document.getElementById('play-button')
    playButton.addEventListener('click', ({ target }) => {
    })
})()
