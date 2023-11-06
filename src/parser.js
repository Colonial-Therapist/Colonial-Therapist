"use strict"

const fs                = require("fs")
const nbt_data          = require("prismarine-nbt")
const NBT               = require("./NBT.js")
const Emotions          = require("./emotions.js")
const Config            = require("./config.js")
const CT_c              = require("./CT")
const Jaf               = require("./jaf.js")

class Parser {
    /**
     * @param {string | Buffer | URL | number} datFile
     * @return CT
     */
    static async getCT(datFile) {
        const colonyKey = Config.get('colonyKey')
        const data      = fs.readFileSync(datFile)
        let CT          = new CT_c

        await nbt_data.parse(data, function (error, data) {
            const nbt = new NBT(data)
            // console.log(nbt)
            //const colonies = nbt.get(''). <- error
            const colonies = nbt.get('').get('data').get('minecolonies:colonymanager').get('colonies').value[colonyKey]

            const name   = new NBT(colonies).get('name')
            const owner  = new NBT(colonies).get('owner')
            const center = getCoordinates(new NBT(colonies).get('center'))
            CT.colony    = {name, owner, center}

            // Builds
            const buildings = new NBT(colonies).get('buildingManager').get('buildings')
            // buildingManager
            // console.log(buildings.value)
            // console.log(buildings.get('0').value)

            function addVacancies(type, level, vacancies) {
                    CT.jobs[type] = CT.jobs[type] ? CT.jobs[type] : 0
                    CT.jobs[type] = CT.jobs[type] + vacancies
            }

            function saveMinMaxCoords(c) {
                if (c.x + c.y + c.z) {
                    CT.map.minX = CT.map.minX < c.x ? CT.map.minX : c.x
                    CT.map.maxX = CT.map.maxX > c.x ? CT.map.maxX : c.x
                    CT.map.minY = CT.map.minY < c.y ? CT.map.minY : c.y
                    CT.map.maxY = CT.map.maxY > c.y ? CT.map.maxY : c.y
                    CT.map.minZ = CT.map.minZ < c.z ? CT.map.minZ : c.z
                    CT.map.maxZ = CT.map.maxZ > c.z ? CT.map.maxZ : c.z
                }
            }

            function getCoordinates(location) {
                const coords = {
                    x: location.x.value,
                    y: location.y.value,
                    z: location.z.value,
                }
                saveMinMaxCoords(coords)
                return coords
            }

            for (const [key, build] of Object.entries(buildings.value)) {
                let type        = build.type.value.replace("minecolonies:", "")
                let name        = build.customName.value ? build.customName.value : type
                const level     = build.level.value
                const location  = build.location.value
                const corner1   = build.corner1.value
                const corner2   = build.corner2.value
                const homes     = ['home', 'tavern']
                const towers    = ['barrackstower', 'guardtower']
                const warehouse = ['warehouse']

                const coordinates = {
                    location: getCoordinates(location),
                    corner1 : getCoordinates(corner1),
                    corner2 : getCoordinates(corner2),
                }

                if (homes.indexOf(type) > -1) {
                    const residents = build?.residents?.value
                    CT.homes[key]   = {type, name, level, key, coordinates, residents}
                } else {
                    if (towers.indexOf(type) > -1) {
                        let residents = ['minecolonies:druid', 'minecolonies:knight', 'minecolonies:ranger']
                            .reduce((a, c) => {
                                let b = build[c].value?.residents?.value
                                return b ? a.concat(b) : a
                            }, [])

                        CT.factories[key] = {type, name, level, key, coordinates, residents}
                    } else {
                        if (warehouse.indexOf(type) > -1) {
                            const residents = build?.warehouse?.value?.couriers?.value
                            CT.factories[key] = {type, name, level, key, coordinates, residents}
                        } else {
                            CT.factories[key] = {type, name, level, key, coordinates}
                        }
                    }

                    Jaf.getVacanciesByFactory(type, level).forEach(v => {
                        v && addVacancies(...v)
                    })
                }
            }

            function getCitizens(citizens, Emotions) {
                // console.log(citizens)
                // console.log(citizens.get('5').value)
                for (let key of Object.entries(citizens.value)) {
                    let citizen            = new NBT(key[1])
                    const rcost            = citizen.root.rcost ? citizen.get('rcost') : ''
                    const chatoptions      = citizen.get('chatoptions')
                    let isVisitor          = 0
                    let isChild            = citizen.get('child')
                    let cost               = []
                    const name             = citizen.get('name')
                    const warriors         = ['ranger', 'knight', 'druid']
                    const job              = citizen.root.job ? citizen.get('job').get('type').replace("minecolonies:", "") : null
                    const isWarrior        = warriors.indexOf(job) > -1
                    const mourning         = citizen.get('mourning')
                    const id               = citizen.get('id')
                    const newSkills        = citizen.get('newSkills') ? citizen.get('newSkills').get('levelMap') : ''
                    const happinessHandler = citizen.get('happinessHandler')
                    const gender           = citizen.get('female') ? 0 : 1
                    const skills           = {}
                    const happiness        = {}
                    let needMaxPriority    = -1
                    const needs            = {}
                    const pos              = getCoordinates(citizen.get('pos'))

                    if (rcost) {
                        isVisitor = 1
                        cost      = [rcost.get('id'), rcost.get('Count')]
                    }

                    for (let [k] of Object.entries(chatoptions.value)) {
                        let chatoption    = new NBT(chatoptions.value[k]).get('chatoption')
                        let priority      = chatoption.get('priority')
                        let inquiry       = JSON.parse(chatoption.get('inquiry'))
                        let translate     = inquiry.translate
                        let translate_reg = /.*\.(\D*)\d*$/
                        let need          = translate_reg.exec(translate)[1]
                        needMaxPriority   = needMaxPriority > priority ? needMaxPriority : priority
                        needs[k]          = {priority, need, inquiry}
                        if (!isVisitor) {
                            CT.needs[priority] = CT.needs[priority] ? ++CT.needs[priority] : 1
                        }
                    }

                    for (const [k] of Object.entries(newSkills.value)) {
                        let newSkill   = new NBT(newSkills.value[k])
                        let experience = newSkill.get('experience')
                        let level      = newSkill.get('level')
                        let skill      = newSkill.get('skill')

                        skills[skill] = {skill, level, experience}
                    }

                    let totalHappiness     = 0
                    let totalEmotionWeight = 0

                    for (const [emotion] of Object.entries(happinessHandler)) {
                        if (emotion !== 'root') {
                            let value          = happinessHandler.get(emotion).get('Value')
                            let day            = happinessHandler.get(emotion).day ? happinessHandler.get(emotion).get('day') : 0
                            totalHappiness += Emotions[emotion] * value
                            totalEmotionWeight += Emotions[emotion]
                            happiness[emotion] = {value, emotion, day}
                        }
                    }

                    const happinessTotal = (totalHappiness / totalEmotionWeight) * 10

                    function delJod(job) {
                        if (job) {
                            CT.jobs[job] = CT.jobs[job] ? --CT.jobs[job] : 1
                        }
                    }

                    switch (true) {
                        case (['miner', 'quarrier'].indexOf(job) > -1):
                            delJod('miner');
                            delJod('quarrier');
                            break
                        case (['knight', 'ranger', 'druid'].indexOf(job) > -1):
                            delJod('knight');
                            delJod('ranger');
                            delJod('druid');
                            break
                        default:
                            delJod(job)
                    }

                    CT.colonists[id] = {
                        name,
                        job,
                        isWarrior,
                        mourning,
                        id,
                        gender,
                        skills,
                        happinessTotal,
                        happiness,
                        isVisitor,
                        isChild,
                        cost,
                        needMaxPriority,
                        needs,
                        pos
                    }
                }
            }

            // Colonists
            const citizens = new NBT(colonies).get('citizenManager').get('citizens')
            getCitizens(citizens, Emotions)

            // Visitors
            const visitors = new NBT(colonies).get('visitManager').get('visitors')
            getCitizens(visitors, Emotions)

            // Researches
            const researches = new NBT(colonies).get('research').get('researchTree')
            for (let key of Object.entries(researches.value)) {
                let research = new NBT(key[1])
                if (research.get('Data').get('state') === 2) {
                    CT.research.push(research.get('Data').get('id'))
                }
            }

            // console.log(CT)
            // console.log(CT.colonists[7].skills)
            // console.log(CT.colonists[15].skills)

        })
        return Promise.resolve(CT)
    }

    /**
     * @param {string | Buffer | URL | number} datFile
     */
    static async getColonies(datFile) {
        const data = fs.readFileSync(datFile)
        let list   = []

        await nbt_data.parse(data, function (error, data) {
            const nbt      = new NBT(data)
            const colonies = nbt.get('').get('data').get('minecolonies:colonymanager').get('colonies')

            for (let [key, colony] of Object.entries(colonies.value)) {
                colony = new NBT(colony)

                key       = Number(key)
                const id        = Number(colony.get('id'))
                const name      = colony.get('name')
                const owner     = colony.get('owner')
                const dimension = colony.get('dimension')

                list[key] = {key, id, name, owner, dimension}
            }
        })
        return Promise.resolve(list)
    }
}

module.exports = Parser