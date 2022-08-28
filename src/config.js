"use strict"

const os   = require("os")
const path = require("path")
const fs   = require("fs")

class Config {
    static userHomeDir    = os.homedir()
    static dir            = path.join(this.userHomeDir + '/.Colonial-Therapist')
    static config_path    = path.join(this.dir, 'config.json')
    static default_config = {
        "worldDir" : "",
        "colonyKey": 0
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
}

module.exports = Config