// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const NBT = require('mcnbt')

let datFile = __dirname + '/' + 'minecolonies/minecraft/overworld/colony1.dat'
// let datFile = 'C:/Users/s_kus/AppData/Roaming/.curseforge/Instances/MineColonies Official/saves/-_-/minecolonies/minecraft/overworld/colony1.dat'
let nbt = new NBT()

let CT = {
    factories: {},
    homes: {},
    colonists: [],
    skills: []
}

nbt.loadFromFile(datFile, function (err) {
    if (err) return console.error(err)
    console.log(nbt)

    // Builds
    let buildings = nbt.select('').select('buildingManager').select('buildings')
    // buildingManager
    // console.log(buildings.value)
    // console.log(buildings.select('0').value)
    for (const [key] of Object.entries(buildings.value)) {
        let build = buildings.select(key).value
        let type = build.type.value.replace("minecolonies:", "")
        let homes = ['home', 'warehouse']

        if (homes.indexOf(type) > -1) {
            CT.homes[key] = {
                type: type,
                level: build.level.value,
                id: key //TODO check id
            }
        } else {
            CT.factories[key] = {
                type: type,
                level: build.level.value,
                id: key
            }
        }
    }

    // Colonists
    let citizens = nbt.select('').select('citizenManager').select('citizens')
    // console.log(citizens)
    // console.log(citizens.select('5').value)
    for (const [key] of Object.entries(citizens.value)) {
        let citizen = citizens.select(key).value
        let warriors = ['ranger', 'knight', 'druid']
        let job = citizen.job ? citizen.job.value.type.value.replace("minecolonies:", "") : null
        let isWarrior = warriors.indexOf(job) > -1

        CT.colonists[key] = {
            name: citizen.name.value,
            job: job,
            isWarrior: isWarrior,
            //level: build.level.value,
            mourning: citizen.mourning.value,
            id: citizen.id.value,
            skills: {},
            happiness: {}
        }
    }

    // console.log(CT)
    // console.log(buildingManage.getType())
    // var gameRules = nbt.select('').select('Data').select('GameRules');
    //"buildingManager"
})