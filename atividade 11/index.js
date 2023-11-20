const sharp = require('sharp');
const fs = require('fs')

async function equalize(input) {
    return await sharp(input)
        .clahe({
            width: 50, // Espaço de busca para o calculo (em pixels)
            height: 50, // Espaço de busca para o calculo (em pixels)
        })
        .toBuffer();
}


let input = '../images/Fig0316(1)(top_left).tif'
equalize(input).then(buffer => fs.writeFileSync('./Fig0316(1)(top_left)_equalized.tif', buffer))

input = '../images/Fig0316(2)(2nd_from_top).tif'
equalize(input).then(buffer => fs.writeFileSync('./Fig0316(2)(2nd_from_top)_equalized.tif', buffer))

input = '../images/Fig0316(3)(third_from_top).tif'
equalize(input).then(buffer => fs.writeFileSync('./Fig0316(3)(third_from_top)_equalized.tif', buffer))

input = '../images/Fig0316(4)(bottom_left).tif'
equalize(input).then(buffer => fs.writeFileSync('./Fig0316(4)(bottom_left)_equalized.tif', buffer))

