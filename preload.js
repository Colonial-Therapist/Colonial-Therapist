const CreateGUI = require('./src/createGUI')
const path      = require("path")
const Parser    = require("./src/parser")
const CT        = require("./src/CT")

// const datFile = path.join(__dirname, 'data/capabilities.dat')
const datFile = path.join('C:/Users/s_kus/AppData/Roaming/.curseforge/Instances/MineColonies Official/saves/-_-/data/capabilities.dat')

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

const emotions = {
    'homelessness': 4,
    'unemployment': 2,
    'health'      : 2,
    'idleatjob'   : 1,

    'school'      : 1,
    'security'    : 2,
    'social'      : 2,
    'saturation'  : 1,
    'mysticalsite': 1,

    'damage'          : 1,
    'death'           : 2,
    'raidwithoutdeath': 1,
    'slepttonight'    : 2,
}

const needsList = [
    'sync',
    'homelessness',
    'noguardnearhome',
    'noguardnearwork',
    'waitingforcure',
    'recruitstory',
    'sleeping',
]

let CT_obj = Parser.getCT(datFile, CT)

window.addEventListener('DOMContentLoaded', () => {
        const el = document.getElementById('content')
        if (el) el.innerHTML = CreateGUI.getGUI(CT_obj)
})