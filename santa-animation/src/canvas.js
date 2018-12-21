export function getGetCTX(canvas) {
    return () => canvas.getContext('2d')
}

export function getSetCanvasSize(canvas) {
    return (width, height) => {
        canvas.width = width
        canvas.height = height
        return canvas
    }
}
