const fs = require('fs');
const ppm = require('ppm');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const collect = require('collect.js');

function pgmToCsv(filepath, output) {
    const file = readPgm(filepath)
    const data = file.data.map(pixel => { return { pixel: parseInt(pixel) } })

    const csvWriter = createCsvWriter({
        path: output,
        header: [
            { id: 'pixel', title: 'PIXEL' }
        ]
    });

    csvWriter.writeRecords(data)
        .then(() => {
            console.log('Arquivo csv escrito com sucesso!');
        });
}

function ppmToCsv(filepath, output) {
    const stream = fs.createReadStream(filepath);

    ppm.parse(stream, function (err, pixels) {
        if (err) {
            console.error("Erro ao ler o arquivo .ppm: ", err);
            return;
        }

        const data = pixels[0].map((pixel, index) => {

            return {
                red: pixel[0],
                green: pixel[1],
                blue: pixel[2]
            };
        });

        const csvWriter = createCsvWriter({
            path: output,
            header: [
                { id: 'red', title: 'RED' },
                { id: 'green', title: 'GREEN' },
                { id: 'blue', title: 'BLUE' }
            ]
        });

        csvWriter.writeRecords(data)
            .then(() => {
                console.log('Arquivo csv escrito com sucesso!');
            });
    });
}

function getMinMax(array) {
    let max = array[0]
    let min = array[0]

    array.forEach((element, i) => {
        if (element > max) 
            max = element
        
        if (element < min)
            min = element
    });

    return [min, max];
}

function highlight(data) {
    const [min, max] = getMinMax(data)
    const a = 255 / (max - min)
    const b = (a * (-1)) * min

    return data.map(pixel => {
        let newPixel = Math.floor((a * pixel) + b)

        if (newPixel > 255) return 255

        if (newPixel < 0) return 0

        return newPixel
    })
}

function ppmHighlight(data) {

}

function readPgm(filepath) {
    const file = fs.readFileSync(filepath).toString().split('\n');
    const type = file.shift();
    const [height, width] = file.shift().split(' ');
    const data = file.map(pixel => parseInt(pixel.replace('\r', '')))

    return { type: type, height: height, width: width, data: data }
}

function writePgm(filepath, file) {
    let pgm = `P2\n${file.width} ${file.height}\n255\n`;
    let counter = 0;

    for (let i = 0; i < file.height; i++) {
        for (let j = 0; j < file.width; j++) {
            pgm += `${file.data[counter]} `;
            counter ++
        }
        pgm += '\n';
    }

    fs.writeFileSync(filepath, pgm)
}

function writePpm(filepath, file) {
    let ppm = `P3\n${file.width} ${file.height}\n255\n`;

    for (let i = 0; i < file.height; i++) {
        for (let j = 0; j < file.width; j++) {
            ppm += `${file.data[i][j].join(' ')} `;
        }
        ppm += '\n';
    }

    fs.writeFileSync(filepath, ppm)
}

// Atividade 10) --------------------------------
pgmToCsv('./images/EntradaEscalaCinza4.pgm', './csv/escalaDeCinza.csv')
ppmToCsv('./images/EntradaRGB.ppm', './csv/escalaRGB.csv')

// Atividade 11) --------------------------------
// pgm
const pgm = readPgm('./images/EntradaEscalaCinza4.pgm')
pgm.data = highlight(pgm.data)
writePgm('./highlighted_images/EntradaEscalaCinza4.pgm', pgm)

// ppm
const stream = fs.createReadStream('./images/EntradaRGB.ppm');
ppm.parse(stream, function (err, pixels) {
    if (err) throw err

    const height = pixels.length
    const width = pixels[0].length

    pixels = pixels.map((line) => {
        let red = highlight(line.map(pixel => pixel[0]))
        let green = highlight(line.map(pixel => pixel[1]))
        let blue = highlight(line.map(pixel => pixel[2]))

        return line.map((pixel, i) => [red[i], green[i], blue[i]])
    })

    writePpm('./highlighted_images/EntradaRBG.ppm', { type: 'P3', height: height, width: width, data: pixels })
})


