const fs = require('fs');
const ppm = require('ppm');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

function pgmToCsv(filepath, output) {
    const file = fs.readFileSync(filepath).toString().split('\n');
    const type = file.shift();
    const [height, width] = file.shift().split(' ');
    const data = file.map(pixel => { return { pixel: parseInt(pixel) }})

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
    const buffer = fs.createReadStream(filepath);

    ppm.parse(buffer, function (err, pixels) {
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


pgmToCsv('./images/EntradaEscalaCinza4.pgm', './csv/escalaDeCinza.csv')
ppmToCsv('./images/EntradaRGB.ppm', './csv/escalaRGB.csv')