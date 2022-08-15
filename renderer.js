// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// // send to console
// console.log(123)
//
// // send text
// const el = document.querySelector('h1')
// if (el) el.innerText = 'test'

// var path = require('path')
// var p = path.join(__dirname, '.', 'README.md')
// const el = document.getElementById('text')
// if (el) el.innerText = p

const fs = require('fs')

let filepath = __dirname + '/' + 'README.md'

fs.readFile(filepath, 'utf-8', (err, data) => {
    if (err) {
        alert("An error ocurred reading the file :" + err.message);
        return;
    }

    const el = document.getElementById('text')
    if (el) el.innerText = data
});
