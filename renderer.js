// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const NBT = require('mcnbt')

let datFile = __dirname + '/' + 'minecolonies/minecraft/overworld/colony1.dat'
let nbt = new NBT()

nbt.loadFromFile(datFile, function(err) {
    if(err) return console.error(err)
    console.log(nbt)
    let buildings = nbt.select('').select('buildingManager').select('buildings')
    // buildingManager
    console.log(buildings)
    // console.log(buildingManage.getType())
    // var gameRules = nbt.select('').select('Data').select('GameRules');
    //"buildingManager"
});