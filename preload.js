const fs                           = require('fs')
const CreateGUI                    = require('./src/createGUI')
const Parser                       = require("./src/parser")
const Config                       = require('./src/config.js')
const {contextBridge, ipcRenderer} = require("electron")

const datFile = Config.getDatFile()

const builds = [
    "archery",
    "baker",
    "barracks",
    "barrackstower",
    "blacksmith",
    "builder",
    "chickenherder",
    "combatacademy",
    "composter",
    "cook",
    "cowboy",
    "crusher",
    "deliveryman",
    "farmer",
    "fisherman",
    "guardtower",
    "home",
    "library",
    "lumberjack",
    "miner",
    "sawmill",
    "shepherd",
    "sifter",
    "smeltery",
    "stonemason",
    "stonesmeltery",
    "swineherder",
    "townhall",
    "warehouse",
    "postbox",
    "florist",
    "enchanter",
    "university",
    "hospital",
    "stash",
    "school",
    "glassblower",
    "dyer",
    "fletcher",
    "mechanic",
    "plantation",
    "tavern",
    "concretemixer",
    "rabbithutch",
    "beekeeper",
    "mysticalsite",
    "graveyard",
    "netherworker",
    "simplequarry",
    "mediumquarry",
    "largequarry",
    "alchemist"
]

const needsList = [
    'sync',
    'homelessness',
    'noguardnearhome',
    'noguardnearwork',
    'waitingforcure',
    'recruitstory',
    'sleeping',
]

// contextBridge.exposeInMainWorld('api', {
//     openDialog: (method, config) => ipcRenderer.invoke('dialog', method, config)
// })

async function getSavePath() {
    const dialogConfig = {
        title      : 'Select a world dir',
        buttonLabel: 'This save dir',
        properties : ['openDirectory']
    }

    let worldDir = ''
    await ipcRenderer.invoke('dialog', 'showOpenDialog', dialogConfig)
        .then(result => worldDir = result.filePaths[0])

    return Promise.resolve(worldDir)
}

window.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('content')

    async function awaitConfig() {
        if (!Config.get('worldDir')) {
            const worldDir = await getSavePath()
            Config.set('worldDir', worldDir)
        }

        if (Config.get('worldDir') && Config.get('colonyKey') < 0) {
            const colonyList = await Parser.getColonies(datFile)
            if (colonyList.length === 1) {
                Config.set('colonyKey', colonyList[0].key)
            } else {
                console.log(colonyList)
            }
        }

        const CT_obj = await Parser.getCT(datFile)
        if (el) el.innerHTML = CreateGUI.getGUI(CT_obj)

        fs.watchFile(datFile, () => {
            Parser.getCT(datFile).then(CT_obj => {
                if (el) el.innerHTML = CreateGUI.getGUI(CT_obj)
            })
        })
    }

    awaitConfig()
})