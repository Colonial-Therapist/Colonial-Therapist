"use strict"

const fs                = require("fs")
const nbt_data          = require("prismarine-nbt")
const NBT               = require("./NBT.js")
const SkillsProfessions = require("./skillsProfessions.js")
const Emotions          = require("./emotions.js")
const Config            = require("./config.js")
const CT_c              = require("./CT")

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

            // Builds
            const buildings = new NBT(colonies).get('buildingManager').get('buildings')
            // buildingManager
            // console.log(buildings.value)
            // console.log(buildings.get('0').value)

            function addJod(type, level, vacancies) {
                if (SkillsProfessions.hasOwnProperty(type) && level > 0) {
                    CT.jobs[type] = CT.jobs[type] ? CT.jobs[type] : 0
                    CT.jobs[type] = CT.jobs[type] + vacancies
                }
            }

            for (const [key, build] of Object.entries(buildings.value)) {
                let type    = build.type.value.replace("minecolonies:", "")
                let name    = build.customName.value ? build.customName.value : type
                const level = build.level.value
                const homes = ['home', 'tavern']

                if (homes.indexOf(type) > -1) {
                    CT.homes[key] = {type, name, level, key}
                } else {
                    CT.factories[key] = {type, name, level, key}

                    let vacancies = 1

                    type = type === 'quarrier' ? 'miner' : type
                    type = type === 'hospital' ? 'healer' : type
                    type = type === 'smeltery' ? 'smelter' : type
                    type = type === 'guardtower' ? 'knight' : type
                    type = type === 'graveyard' ? 'undertaker' : type
                    type = type === 'rabbithutch' ? 'rabbitherder' : type

                    if (type === 'builder' && level === 0) {
                        addJod(type, 1, 1)
                    }

                    if (type === 'barrackstower') {
                        type      = 'knight'
                        vacancies = 1 * level
                    }

                    if (type === 'university') {
                        type      = 'researcher'
                        vacancies = 1 * level
                    }

                    if (type === 'school') {
                        type = 'teacher'
                        addJod('pupil', level, 2 * level)
                    }

                    if (type === 'library') {
                        type      = 'student'
                        vacancies = 2 * level
                    }

                    if (type === 'cook') {
                        level >= 3 && addJod('cookassistant', level, 1)
                    }

                    addJod(type, level, vacancies)
                }
            }
            CT.jobs['quarrier'] = CT.jobs['miner']

            CT.jobs['ranger'] = CT.jobs['knight']
            CT.jobs['druid']  = CT.jobs['knight']

            function getCitizens(citizens, Emotions) {
                // console.log(citizens)
                // console.log(citizens.get('5').value)
                for (let [key, citizen] of Object.entries(citizens.value)) {
                    citizen                = new NBT(citizen)
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
                        needs
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
            for (let [key, research] of Object.entries(researches.value)) {
                research = new NBT(research)
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