// window.addEventListener('DOMContentLoaded', () => {
//
// })


const NBT = require('mcnbt')

const datFile = __dirname + '/' + 'minecolonies/minecraft/overworld/colony1.dat'
// let datFile = __dirname + '/' + 'minecolonies/colonies.dat'
// let datFile = 'C:/Users/s_kus/AppData/Roaming/.curseforge/Instances/MineColonies Official/saves/-_-/minecolonies/minecraft/overworld/colony1.dat'
// let datFile = 'C:/Users/s_kus/AppData/Roaming/.curseforge/Instances/MineColonies Official/saves/-_-/minecolonies/colonies.dat'
// let datFile = __dirname + '/' + 'data/capabilities.dat'
// let datFile = 'C:/Users/s_kus/AppData/Roaming/.curseforge/Instances/MineColonies Official/saves/-_-/data/capabilities.dat'
const nbt = new NBT()

const skillsLabelsRus = {
    0 : 'Атлетика',
    1 : 'Ловкость',
    2 : 'Сила',
    3 : 'Проворство',
    4 : 'Выносливость',
    5 : 'Мана',
    6 : 'Приспособляемость',
    7 : 'Сфокусированность',
    8 : 'Креативность',
    9 : 'Знание',
    10: 'Интеллект'
}

const skillsLabels = {
    0 : 'Athletics',
    1 : 'Dexterity',
    2 : 'Strength',
    3 : 'Agility',
    4 : 'Stamina',
    5 : 'Mana',
    6 : 'Adaptability',
    7 : 'Focus',
    8 : 'Creativity',
    9 : 'Knowledge',
    10: 'Intelligence'
}

const skillsProfessions = {
    'alchemist'      : [1, 5],
    'archer'         : [3, 6],
    'assistant cook' : [8, 9],
    'baker'          : [9, 1],
    'beekeeper'      : [1, 6],
    'blacksmith'     : [2, 7],
    'builder'        : [6, 0],
    'carpenter'      : [9, 1],
    'chicken farmer' : [6, 3],
    'composter'      : [4, 0],
    'concrete mixer' : [4, 1],
    'cook'           : [6, 9],
    'courier'        : [3, 6],
    'cowboy'         : [0, 4],
    'deliveryman'    : [4, 2],
    'druid'          : [5, 7],
    'dyer'           : [8, 1],
    'enchanter'      : [5, 9],
    'farmer'         : [4, 0],
    'fisher'         : [7, 3],
    'fletcher'       : [1, 8],
    'florist'        : [1, 3],
    'lumberjack'     : [2, 7],
    'glassblower'    : [8, 7],
    'healer'         : [5, 9],
    'knight'         : [6, 4],
    'library student': [10, null],
    'mechanic'       : [9, 3],
    'miner'          : [2, 4],
    'nether miner'   : [6, 2],
    'planter'        : [3, 1],
    'pupil'          : [[10, 9], 5],
    'quarrier'       : [2, 4],
    'rabbit herder'  : [3, 0],
    'shepherd'       : [7, 2],
    'sifter'         : [7, 2],
    'smelter'        : [0, 2],
    'stonemason'     : [8, 1],
    'stone smelter'  : [0, 1],
    'swineherd'      : [2, 0],
    'teacher'        : [9, 5],
    'undertaker'     : [2, 5],
    'researcher'     : [9, 5],
}

const CT = {
    factories: {},
    homes    : {},
    colonists: [],
    skills   : []
}

nbt.loadFromFile(datFile, function (err) {
    if (err) return console.error(err)
    console.log(nbt)

    // Builds
    const buildings = nbt.select('').select('buildingManager').select('buildings')
    // buildingManager
    // console.log(buildings.value)
    // console.log(buildings.select('0').value)
    for (const [key] of Object.entries(buildings.value)) {
        const build = buildings.select(key).value
        const type = build.type.value.replace("minecolonies:", "")
        const name = build.customName.value ? build.customName.value : type
        const level = build.level.value
        const homes = ['home', 'tavern']

        if (homes.indexOf(type) > -1) {
            CT.homes[key] = {type, name, level, key}
        } else {
            CT.factories[key] = {type, name, level, key}
        }
    }

    // Colonists
    let citizens = nbt.select('').select('citizenManager').select('citizens')
    // console.log(citizens)
    // console.log(citizens.select('5').value)
    for (const [key] of Object.entries(citizens.value)) {
        const citizen = citizens.select(key).value
        const name = citizen.name.value
        const warriors = ['ranger', 'knight', 'druid']
        const job = citizen.job ? citizen.job.value.type.value.replace("minecolonies:", "") : null
        const isWarrior = warriors.indexOf(job) > -1
        const mourning = citizen.mourning.value
        const id = citizen.id.value
        const newSkills = citizens.select(key).select('newSkills').select('levelMap');
        const sex = citizen.female.value ? 0 : 1
        const skills = {}
        const happiness = {}

        for (const [k] of Object.entries(newSkills.value)) {
            let experience = newSkills.select(k).value.experience.value
            let level = newSkills.select(k).value.level.value
            let skill = newSkills.select(k).value.skill.value

            skills[skill] = {skill, level, experience}
        }

        CT.colonists[key] = {name, job, isWarrior, mourning, id, sex, skills, happiness,}
    }

    console.log(CT)
    console.log(CT.colonists[7].skills)
    console.log(CT.colonists[15].skills)
    // console.log(buildingManage.getType())
    // var gameRules = nbt.select('').select('Data').select('GameRules');
    //"buildingManager"
})

window.addEventListener('DOMContentLoaded', () => {

    const headJobs = ['builder', 'deliveryman', 'miner', 'cowboy', 'beekeeper']
    const rate = [8, 2]

    const el = document.getElementById('content')
    let table = `
<table class="sortable" border="0">
    <thead><tr><th></th><th></th>`

    for (const [k, job] of Object.entries(headJobs)) {
        table += `<th>${job}</th>`
    }

    table += `
</tr>
</thead>
    <tbody>`
    for (const [key] of Object.entries(CT.colonists)) {
        let col = CT.colonists[key]
        let sex = col.sex ? '♂' : '♀'
        table += `<td>${sex}</td><td>${col.name}</td>`

        for (const [k, job] of Object.entries(headJobs)) {
            let work = job === col.job ? 'active' : ''
            let firstReqSkill = skillsProfessions[job][0]
            let secondReqSkill = skillsProfessions[job][1]

            let firstCurSkill = col.skills[firstReqSkill].level
            let secondCurSkill = col.skills[secondReqSkill].level

            // range 10 - 990
            let ball = firstCurSkill * rate[0] + secondCurSkill * rate[1]
            let square = 4
            switch (true) {
                case ball<=60:  square = 0; break
                case ball<=90:  square = 2; break
                case ball<=140: square = 4; break
                case ball<=190: square = 6; break
                case ball<=290: square = 10; break
                case ball<=390: square = 14; break
                case ball<=990: square = 18; break
            }

            let skillList = '';
            for (const [k, skill] of Object.entries(col.skills)) {
                let skillFirst = skill.skill === firstReqSkill ? 'first' : ''
                let skillSecond = skill.skill === secondReqSkill ? 'second' : ''
                skillList += `<span class="${skillFirst} ${skillSecond}">` + skillsLabelsRus[skill.skill] + ': ' + skill.level + "</span><br>"
            }

            table += `<td class="${work} s_cell" data-sort="${ball}">
                        <span class="square" style="--square: ${square}px;"></span>
                        <span class="tip">${skillList}</span>
                     </td>`
        }
        table += '</tr>'
    }
    table += `
    </tbody>
</table>
`
    if (el) el.innerHTML = table
})