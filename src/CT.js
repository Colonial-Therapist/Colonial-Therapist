"use strict"

class CT {
    constructor() {
        this.factories = {}
        this.homes     = {}
        this.colonists = {}
        this.jobs      = []
        this.needs     = [0, 0, 0, 0]
        this.research  = []
    }
}

module.exports = CT