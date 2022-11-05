"use strict"

const Config = require("./config.js")

class Translate {
    // static currentLang = 'en_en'
    // static currentLang = 'ru_ru'
    static currentLang = Config.get('currentLang')
    static lang        = require(`./lang/${this.currentLang}.json`)
    static langDef     = require(`./lang/en_en.json`)

    static text(key) {
        key = key.toLowerCase()
        let lang = this.lang[key] ? this.lang[key] : this.langDef[key]
        return lang ? lang : key
    }
}

module.exports = Translate