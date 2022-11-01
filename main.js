let { writeFile } = require('fs');
let { join } = require('path');
let request = require('request');
let mergeImg = require('merge-img');
let argv = require('minimist')(process.argv.slice(2));







// 1. Define dimensions and params
let {
    greeting = 'Hello',
        who = 'You',
        width = 400,
        height = 500,
        color = 'Pink',
        size = 100,
} = argv;

// 2. First req
let firstReq = {
    // https://cataas.com/cat/says/Hi%20There?width=500&amp;height=800&amp;c=Cyan&amp;s=150
    url: 'https://cataas.com/cat/says/' +
        greeting +
        '?width=' +
        width +
        '&height=' +
        height +
        '&color' +
        color +
        '&s=' +
        size,
    encoding: 'binary',
};

// 3. Second req
let secondReq = {
    url: 'https://cataas.com/cat/says/' +
        who +
        '?width=' +
        width +
        '&height=' +
        height +
        '&color' +
        color +
        '&s=' +
        size,
    encoding: 'binary',
};

// 4. Get
// 4.1 Req 1
request.get(firstReq, (err, res, firstBody) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Received response with status:' + res.statusCode);

    // 4.2 Req 2
    request.get(secondReq, (err, res, secondBody) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Received response with status:' + res.statusCode);
        // 4.3 mergeImg
        mergeImg([{
                src: Buffer.from(firstBody, 'binary'),
                x: 0,
                y: 0
            },
            {
                src: Buffer.from(secondBody, 'binary'),
                x: width,
                y: 0
            },
        ]).then((img) => {
            // 4.4 getBuffer
            // 4.5 writeFile
            img.getBuffer('image/gif', (buffer) => {

                const fileOut = join(process.cwd(), `/cat-card.jpg`);

                writeFile(fileOut, buffer, 'binary', (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    console.log('The file was saved!');
                });
            });
        }).catch((err)=> {
            console.log('there has been an error while meargin the images');
            console.log(err);
        });
    });
});