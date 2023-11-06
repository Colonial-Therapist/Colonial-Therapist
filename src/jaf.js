"use strict"

class Jaf {
    static getFirstJobByFactory(factory) {
        if (!factory) return ''

        const hashMap = {
            hospital     : 'healer',
            university   : 'researcher',
            smeltery     : 'smelter',
            graveyard    : 'undertaker',
            library      : 'student',
            rabbithutch  : 'rabbitherder',
            plantation   : 'planter',
            guardtower   : 'knight',
            barracks     : 'knight',
            barrackstower: 'knight',
            school       : 'pupil',
            combatacademy: 'combattraining',
            archery      : 'archertraining'
        }

        return hashMap[factory] ? hashMap[factory] : factory
    }

    static getVacanciesByFactory(factory, level) {
        if ((level > 0 || factory === 'builder') && level <= 5) {
            let vacancies = 1
            let res       = []

            factory = factory === 'quarrier' ? 'miner' : factory
            factory = factory === 'hospital' ? 'healer' : factory
            factory = factory === 'smeltery' ? 'smelter' : factory
            factory = factory === 'guardtower' ? 'knight' : factory
            factory = factory === 'graveyard' ? 'undertaker' : factory
            factory = factory === 'rabbithutch' ? 'rabbitherder' : factory
            factory = factory === 'plantation' ? 'planter' : factory

            if (factory === 'barrackstower') {
                factory   = 'knight'
                vacancies = 1 * level
                res.push(['ranger', level, vacancies])
                res.push(['druid', level, vacancies])
            }

            if (factory === 'combatacademy') {
                factory   = 'combattraining'
                vacancies = 1 * level
            }

            if (factory === 'archery') {
                factory   = 'archertraining'
                vacancies = 1 * level
            }

            if (factory === 'university') {
                factory   = 'researcher'
                vacancies = 1 * level
            }

            if (factory === 'school') {
                factory = 'teacher'
                res.push(['pupil', level, 2 * level])
            }

            if (factory === 'library') {
                factory   = 'student'
                vacancies = 2 * level
            }

            if (factory === 'cook') {
                level >= 3 && res.push(['cookassistant', level, 1])
            }

            res.push([factory, level, vacancies])

            return res
        } else {
            return [false]
        }
    }
}

module.exports = Jaf