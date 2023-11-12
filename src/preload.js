const fs                           = require('fs')
const CreateGUI                    = require('./createGUI')
const Parser                       = require("./parser")
const Config                       = require('./config.js')
const {contextBridge, ipcRenderer} = require("electron")
const Translate                    = require("./translate.js")
const AppName                      = require("./appName")
const path                         = require("path")
const CreateMap                    = require("./createMap.js")

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

// contextBridge.exposeInMainWorld('api', {
//     openDialog: (method, config) => ipcRenderer.invoke('dialog', method, config)
// })

async function getSavePath() {
    const dialogConfig = {
        title      : Translate.text(`dialog.select world`),
        buttonLabel: Translate.text(`dialog.save dir`),
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

            cell.addEventListener("mouseout", () => {
                const elNumb = document.querySelector(`th:nth-child(${numbTr})`)
                if (elNumb) {
                    elNumb.classList.remove("hover")
                }
                numbTr = 0
            })
        }
    )
}

function toggleResidents(idHome, display) {
    const lines = document.querySelectorAll(`path[data-id-build='${idHome}']`)
    lines.forEach(line => {
        const idCol   = line.dataset.idCol
        const targets = document.querySelectorAll(`.lines [data-id-build='${idHome}'][data-id-col='${idCol}'], .colonists [data-id-col='${idCol}']`)
        targets.forEach(el => el.style.display = display)
    })
}

function buildHover() {
    const build = document.querySelectorAll(".bh[data-id-build]")
    build.forEach(
        home => {
            home.addEventListener("mouseenter", event =>
                toggleResidents(event.target.dataset.idBuild, 'block')
            )

            home.addEventListener("mouseout", event =>
                toggleResidents(event.target.dataset.idBuild, 'none')
            )
        }
    )
}

function guardHoverArea() {
    const towers = document.querySelectorAll(".barrackstower[data-id-build], .guardtower[data-id-build]")
    towers.forEach(
        tower => {
            tower.addEventListener("mouseenter", event => {
                    const el         = document.querySelector(`circle[data-id-build='${event.target.dataset.idBuild}']`)
                    el.style.display = 'block'
                }
            )

            tower.addEventListener("mouseout", event => {
                    const el = document.querySelector(`circle[data-id-build='${event.target.dataset.idBuild}']`)
                    if (el) {
                        el.style.display = 'none'
                    }
                }
            )
        }
    )
}

function toggles(toggleName, invert) {
    const toggle = document.querySelector('#' + toggleName)
    const CT_table = document.querySelector(".CT_table")
    const capName = toggleName.charAt(0).toUpperCase() + toggleName.slice(1)
    toggle.addEventListener('change', () => {
        if (invert) {
            toggle.checked ? CT_table.classList.add("hide" + capName) : CT_table.classList.remove("hide" + capName)
        } else {
            toggle.checked ? CT_table.classList.remove("hide" + capName) : CT_table.classList.add("hide" + capName)
        }
        ipcRenderer.invoke('config', 'toggle', [toggleName, toggle.checked])
    })
}

function tabs() {
    let tabNav     = document.querySelectorAll('.tab:not(.disabled)')
    let tabContent = document.querySelectorAll('.tab_content')

    tabNav.forEach(item => {
        item.addEventListener('click', selectTabNav)
    })

    function selectTabNav() {
        tabNav.forEach(item => {
            item.classList.remove('active')
        })
        this.classList.add('active')
        selectTabContent(this.id.replace(/tab-/i, ''))
    }

    function selectTabContent(tabName) {
        tabContent.forEach(item => {
            item.id === tabName ? item.classList.remove('hidden') : item.classList.add('hidden')
        })
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('content')
    let tab  = document.querySelectorAll('.tab')

    tab.forEach(item => item.innerHTML = Translate.text('tab.' + item.dataset.name))

    async function awaitConfig() {
        if (!Config.get('worldDir')) {
            const worldDir = await getSavePath()
            if (worldDir) {
                Config.set('worldDir', worldDir)
            }
        }

        if (Config.get('worldDir') && Config.get('colonyKey') < 0) {
            const colonyList = await Parser.getColonies(datFile)
            if (colonyList.length === 1) {
                Config.set('colonyKey', colonyList[0].key)
            } else {
                console.log(colonyList)
            }
        } else {
            const colonyList = await Parser.getColonies(datFile)
            if (!colonyList[Config.get('colonyKey')]) {
                Config.set('colonyKey', -1)
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
                toggles('notBuild', true)
                toggles('civ')
                toggles('vis')
                toggles('unw')
                toggles('mil')
                tabs()

                CreateMap.create(CT_obj)

                buildHover()
                //guardHoverArea()
            }
        }

        if (Config.get('colonyKey') < 0) {
            if (el) el.innerHTML = `<div class="err">${Translate.text('error.colonies not found')}</div>`
        } else {
            const CT_obj = await Parser.getCT(datFile)

            const save = path.basename(Config.get('worldDir'))
            await ipcRenderer.invoke('setTitle', `${save} - ${AppName.get()}`)

            GUI(CT_obj)

            fs.watchFile(datFile, () => {
                Parser.getCT(datFile).then(CT_obj => {
                    GUI(CT_obj)
                })
            })
        }
    }

    awaitConfig()
})