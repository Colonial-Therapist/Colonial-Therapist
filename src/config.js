"use strict"

const os   = require("os")
const path = require("path")
const fs   = require("fs")

class Config {
    static userHomeDir    = os.homedir()
    static dir            = path.join(this.userHomeDir + '/.Colonial-Therapist')
    static config_path    = path.join(this.dir, 'config.json')
    static default_config = {
        "worldDir"   : "",
        "colonyKey"  : -1,
        "currentLang": "en_en",
        "openRecent" : []
    }

    static getConfig() {
        if (!fs.existsSync(this.dir)) {
            fs.mkdirSync(this.dir)
        }

        if (!fs.existsSync(this.config_path)) {
            fs.writeFileSync(this.config_path, JSON.stringify(this.default_config, null, 4), {flag: 'wx'})
        }
        return require(this.config_path)
    }

    static getDatFile() {
        return path.join(this.getConfig().worldDir, 'data/capabilities.dat')
    }

    static get(key) {
        return this.getConfig()[key]
    }

    static set(key, value) {
        let newConfig  = this.getConfig()
        newConfig[key] = value

        if (key === 'worldDir') {
            newConfig.openRecent.unshift(value)
            newConfig.openRecent = newConfig.openRecent.filter((v, i, a) => a.indexOf(v) === i).slice(0, 10)
        }

        fs.writeFileSync(this.config_path, JSON.stringify(newConfig, null, 4))
    }
}

module.exports = Config