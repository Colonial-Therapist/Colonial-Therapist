// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.


// const func = async () => {
//     const dialogConfig = {
//         title      : 'Select a world dir',
//         buttonLabel: 'This one will do',
//         properties : ['openDirectory']
//     }
//
//     window.api.openDialog('showOpenDialog', dialogConfig)
//         .then(result => console.log(result.filePaths[0]))
// }

//func()

function tips() {
    tippy('td.s_cell, td.need', {
        content(reference) {
            const tip = reference.querySelector('.tip')
            return tip ? tip.innerHTML : null
        },
        allowHTML: true,
        // trigger: 'click',
        placement: 'right',
        animation: false,
        theme: 'light',
    })
}

window.addEventListener('DOMContentLoaded', () => {
    tips()
})