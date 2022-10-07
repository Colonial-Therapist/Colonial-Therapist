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

function columnHover() {
    let numbTr  = 0
    const cells = document.querySelectorAll(".s_cell");
    cells.forEach(
        cell => {
            cell.addEventListener("mouseenter", (event) => {
                event.target.classList.add("numb-mark")
                let tds = event.target.closest("tr").querySelectorAll('td')
                for (let td of tds) {
                    numbTr++
                    if (td.classList.contains('numb-mark')) {
                        break
                    }
                }
                event.target.classList.remove("numb-mark")
                document.querySelector(`th:nth-child(${numbTr})`).classList.add("hover")
            })

            cell.addEventListener("mouseout", (event) => {
                const elNumb = document.querySelector(`th:nth-child(${numbTr})`)
                if (elNumb) {
                    elNumb.classList.remove("hover")
                }
                numbTr = 0
            })
        }
    )
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

        function GUI(CT_obj) {
            if (el) el.innerHTML = CreateGUI.getGUI(CT_obj)

            if (localStorage.numb && localStorage.dir) {
                let sortColumn = document.querySelector(`.sortable th:nth-child(${localStorage.numb})`)

                sortColumn.classList.add(localStorage.dir.trim())
                sortColumn.click()
                sortColumn.click()

                columnHover()
            }
        }

        const CT_obj = await Parser.getCT(datFile)
        GUI(CT_obj)

        fs.watchFile(datFile, () => {
            Parser.getCT(datFile).then(CT_obj => {
                GUI(CT_obj)
            })
        })
    }

    awaitConfig()
})