"use strict"

const {name, version} = require("../package.json");

class AppName {
    static capitalizeFirstLetter(string) {
        const words = string.split(" ")

        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1)
        }

        return words.join(" ")
    }

    static get() {
        let title = name.replace('-', ' ')
        return this.capitalizeFirstLetter(title) + ' ' + version
    }
}

module.exports = AppName