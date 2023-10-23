const Jaf = require('./jaf.js')

describe('getFirstJobByFactory method', () => {
    test('return valid job', () => {
        expect(Jaf.getFirstJobByFactory('hospital')).toEqual('healer')
        expect(Jaf.getFirstJobByFactory('university')).toEqual('researcher')
        expect(Jaf.getFirstJobByFactory('smeltery')).toEqual('smelter')
        expect(Jaf.getFirstJobByFactory('graveyard')).toEqual('undertaker')
        expect(Jaf.getFirstJobByFactory('library')).toEqual('student')
        expect(Jaf.getFirstJobByFactory('rabbithutch')).toEqual('rabbitherder')
        expect(Jaf.getFirstJobByFactory('plantation')).toEqual('planter')
        expect(Jaf.getFirstJobByFactory('guardtower')).toEqual('knight')
        expect(Jaf.getFirstJobByFactory('barracks')).toEqual('knight')
        expect(Jaf.getFirstJobByFactory('barrackstower')).toEqual('knight')
        expect(Jaf.getFirstJobByFactory('school')).toEqual('pupil')
        expect(Jaf.getFirstJobByFactory('combatacademy')).toEqual('combattraining')
        expect(Jaf.getFirstJobByFactory('archery')).toEqual('archertraining')
    })

    test('returns an empty string for invalid values', () => {
        expect(Jaf.getFirstJobByFactory('')).toEqual('')
        expect(Jaf.getFirstJobByFactory(null)).toEqual('')
        expect(Jaf.getFirstJobByFactory(undefined)).toEqual('')
    })
})


describe('getVacanciesByFactory method', () => {
    test('return valid vacancies', () => {
        expect(Jaf.getVacanciesByFactory('quarrier', 2)).toEqual([['miner', 2, 1]])
        expect(Jaf.getVacanciesByFactory('hospital', 2)).toEqual([['healer', 2, 1]])
        expect(Jaf.getVacanciesByFactory('smeltery', 2)).toEqual([['smelter', 2, 1]])
        expect(Jaf.getVacanciesByFactory('guardtower', 2)).toEqual([['knight', 2, 1]])
        expect(Jaf.getVacanciesByFactory('graveyard', 2)).toEqual([['undertaker', 2, 1]])
        expect(Jaf.getVacanciesByFactory('rabbithutch', 2)).toEqual([['rabbitherder', 2, 1]])
        expect(Jaf.getVacanciesByFactory('plantation', 2)).toEqual([['planter', 2, 1]])
        expect(Jaf.getVacanciesByFactory('builder', 0)).toEqual([['builder', 0, 1]])
        expect(Jaf.getVacanciesByFactory('builder', 2)).toEqual([['builder', 2, 1]])
        expect(Jaf.getVacanciesByFactory('barrackstower', 3).sort()).toEqual([
            ['knight', 3, 3],
            ['ranger', 3, 3],
            ['druid', 3, 3]
        ].sort())
        expect(Jaf.getVacanciesByFactory('university', 4)).toEqual([['researcher', 4, 4]])
        expect(Jaf.getVacanciesByFactory('school', 3).sort()).toEqual([
            ['teacher', 3, 1],
            ['pupil', 3, 6]
        ].sort())
        expect(Jaf.getVacanciesByFactory('library', 3)).toEqual([['student', 3, 6]])
        expect(Jaf.getVacanciesByFactory('cook', 2)).toEqual([['cook', 2, 1]])
        expect(Jaf.getVacanciesByFactory('cook', 4).sort()).toEqual([
            ['cook', 4, 1],
            ['cookassistant', 4, 1]
        ].sort())
        expect(Jaf.getVacanciesByFactory('combatacademy', 2)).toEqual([['combattraining', 2, 2]])
        expect(Jaf.getVacanciesByFactory('archery', 4)).toEqual([['archertraining', 4, 4]])
    })

    test('returns an false for invalid values', () => {
        expect(Jaf.getVacanciesByFactory('','')).toEqual([false])
        expect(Jaf.getVacanciesByFactory(null, null)).toEqual([false])
        expect(Jaf.getVacanciesByFactory(undefined, undefined)).toEqual([false])
        expect(Jaf.getVacanciesByFactory('undefined', 'undefined')).toEqual([false])
        expect(Jaf.getVacanciesByFactory('quarrier', 0)).toEqual([false])
        expect(Jaf.getVacanciesByFactory('quarrier', 10)).toEqual([false])
        expect(Jaf.getVacanciesByFactory('barrackstower', 6)).toEqual([false])
    })
})
