const {app, Menu, shell, dialog} = require('electron')
const Config                     = require("./config.js")
const path                       = require("path");
const Translate                  = require("./translate.js");

const isMac = process.platform === 'darwin'

function restart() {
    app.relaunch({ execPath: process.env.PORTABLE_EXECUTABLE_FILE })
    app.quit()
}

const openRecent      = Config.get('openRecent')
let submenuOpenRecent = []
let numb              = 1
for (const save of openRecent) {
    submenuOpenRecent.push({
        label: numb++ + ": " + path.basename(save),
        click: () => {
            Config.set('worldDir', save)
            restart()
        }
    })
}

const testFolder  = 'src/lang/';
const fs          = require('fs');
const currentLang = Config.get('currentLang')
let availableLang = []

fs.readdirSync(testFolder).forEach(file => {
    availableLang.push(file)
})

let submenuLanguage = []
for (const lang of availableLang) {
    let nameLang = path.parse(lang).name
    let cur = currentLang === nameLang ? 'v' : '-'
    submenuLanguage.push({
        label: cur + ' ' + Translate.text(lang),
        click: () => {
            if (currentLang !== nameLang) {
                Config.set('currentLang', nameLang)
                restart()
            }
        }
    })
}

const template = [
    {
        label  : Translate.text(`menu.file`),
        submenu: [
            {
                label      : Translate.text(`menu.open save`),
                accelerator: 'CmdOrCtrl+O',
                click      : async () => {

                    const dialogConfig = {
                        title      : Translate.text(`dialog.select world`),
                        buttonLabel: Translate.text(`dialog.save dir`),
                        properties : ['openDirectory']
                    }

                    let res      = await dialog.showOpenDialog(dialogConfig)
                    let worldDir = res.filePaths[0]

                    if (worldDir) {
                        Config.set('worldDir', worldDir)
                        app.relaunch()
                        app.exit(0)
                    }
                }
            },
            {
                label  : Translate.text('menu.open recent'),
                submenu: submenuOpenRecent
            },
            isMac ? {role: 'close'} : {role: 'quit'}
        ]
    },
    {
        label  : Translate.text(`menu.language`),
        submenu: submenuLanguage
    },
    {role: 'viewMenu'},
    {role: 'windowMenu'},
    {
        label: 'GitHub',
        click: async () => {
            await shell.openExternal('https://github.com/Colonial-Therapist/Colonial-Therapist')
        }

    }
]

module.exports.mainMenu = Menu.buildFromTemplate(template)