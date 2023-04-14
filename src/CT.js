"use strict"

class CT {
    constructor() {
        this.colony    = {}
        this.factories = {}
        this.homes     = {}
        this.colonists = {}
        this.jobs      = []
        this.needs     = [0, 0, 0, 0]
        this.research  = []
        this.map       = {}
    }
}

module.exports = CT