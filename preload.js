const fs        = require('fs')
const CreateGUI = require('./src/createGUI')
const Parser    = require("./src/parser")
const CT        = require("./src/CT")
const Config    = require('./src/config.js')

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

window.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('content')

    Parser.getCT(datFile, CT).then(CT_obj => {
        if (el) el.innerHTML = CreateGUI.getGUI(CT_obj)
    })

    fs.watchFile(datFile, () => {
        Parser.getCT(datFile, CT).then(CT_obj => {
            if (el) el.innerHTML = CreateGUI.getGUI(CT_obj)
        })
    })
})