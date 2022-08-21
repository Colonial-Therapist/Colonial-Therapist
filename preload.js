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
    'alchemist'      : [1, 5], //
    'ranger'         : [3, 6], //
    'assistant cook' : [8, 9], //
    'baker'          : [9, 1], //
    'beekeeper'      : [1, 6], //
    'blacksmith'     : [2, 7], //
    'builder'        : [6, 0], //
    'carpenter'      : [9, 1], //
    'chicken farmer' : [6, 3], //
    'composter'      : [4, 0], //
    'concrete mixer' : [4, 1], //
    'cook'           : [6, 9], //
    'deliveryman'    : [3, 6], //
    'cowboy'         : [0, 4], //
    'crusher'        : [4, 2], //
    'druid'          : [5, 7], //
    'dyer'           : [8, 1], //
    'enchanter'      : [5, 9], //
    'farmer'         : [4, 0], //
    'fisherman'      : [7, 3], //
    'fletcher'       : [1, 8], //
    'florist'        : [1, 3], //
    'lumberjack'     : [2, 7], //
    'glassblower'    : [8, 7], //
    'healer'         : [5, 9], //
    'knight'         : [6, 4], //
    'library student': [10, null],
    'mechanic'       : [9, 3], //
    'miner'          : [2, 4], //
    'nether miner'   : [6, 2], //
    'planter'        : [3, 1], //
    'pupil'          : [[10, 9], 5], //
    'quarrier'       : [2, 4], //
    'rabbit herder'  : [3, 0], //
    'shepherd'       : [7, 2], //
    'sifter'         : [7, 2], //
    'smelter'        : [0, 2], //
    'stonemason'     : [8, 1], //
    'stone smelter'  : [0, 1], //
    'swineherd'      : [2, 0], //
    'teacher'        : [9, 5], //
    'undertaker'     : [2, 5],
    'researcher'     : [9, 5], //
}

const builds = [
    "archery",
    "baker",
    "barracks",
    "barrackstower",
    "blacksmith",
    "builder",
    "chickenherder",
    "combatacademy",
    "composter",
    "cook",
    "cowboy",
    "crusher",
    "deliveryman",
    "farmer",
    "fisherman",
    "guardtower",
    "home",
    "library",
    "lumberjack",
    "miner",
    "sawmill",
    "shepherd",
    "sifter",
    "smeltery",
    "stonemason",
    "stonesmeltery",
    "swineherder",
    "townhall",
    "warehouse",
    "postbox",
    "florist",
    "enchanter",
    "university",
    "hospital",
    "stash",
    "school",
    "glassblower",
    "dyer",
    "fletcher",
    "mechanic",
    "plantation",
    "tavern",
    "concretemixer",
    "rabbithutch",
    "beekeeper",
    "mysticalsite",
    "graveyard",
    "netherworker",
    "simplequarry",
    "mediumquarry",
    "largequarry",
    "alchemist"
]

const emotions = {
    'homelessness': 4,
    'unemployment': 2,
    'health'      : 2,
    'idleatjob'   : 1,

    'school'      : 1,
    'security'    : 2,
    'social'      : 2,
    'saturation'  : 1,
    'mysticalsite': 1,

    'damage'          : 1,
    'death'           : 2,
    'raidwithoutdeath': 1,
    'slepttonight'    : 2,
}

const needsList = [
    'sync',
    'homelessness',
    'noguardnearhome',
    'noguardnearwork',
    'waitingforcure',
    'recruitstory',
    'sleeping',
]

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

    function getCitizens(citizens, emotions) {
        // console.log(citizens)
        // console.log(citizens.select('5').value)
        for (const [key] of Object.entries(citizens.value)) {
            const citizen = citizens.select(key).value
            const rcost = citizens.select(key).select('rcost')
            const chatoptions = citizens.select(key).select('chatoptions')
            let isVisitor = 0
            let cost = []
            const name = citizen.name.value
            const warriors = ['ranger', 'knight', 'druid']
            const job = citizen.job ? citizen.job.value.type.value.replace("minecolonies:", "") : null
            const isWarrior = warriors.indexOf(job) > -1
            const mourning = citizen.mourning.value
            const id = citizen.id.value
            const newSkills = citizens.select(key).select('newSkills').select('levelMap')
            const happinessHandler = citizens.select(key).select('happinessHandler')
            const gender = citizen.female.value ? 0 : 1
            const skills = {}
            const happiness = {}
            let needMaxPriority = 0
            const needs = {}

            if (rcost) {
                isVisitor = 1;
                cost = [rcost.select('id').value, rcost.select('Count').value]
            }

            for (const [k] of Object.entries(chatoptions.value)) {
                let chatoption = chatoptions.select(k).select('chatoption')
                let priority = chatoption.select('priority').value
                let inquiry = JSON.parse(chatoption.select('inquiry').value)
                let translate = inquiry.translate
                let translate_reg = /.*\.(\D*)\d*$/
                let need = translate_reg.exec(translate)[1]
                needMaxPriority = needMaxPriority > priority ? needMaxPriority : priority
                needs[k] = { priority, need, inquiry }
            }

            for (const [k] of Object.entries(newSkills.value)) {
                let experience = newSkills.select(k).value.experience.value
                let level = newSkills.select(k).value.level.value
                let skill = newSkills.select(k).value.skill.value

                skills[skill] = {skill, level, experience}
            }

            let totalHappiness = 0
            let totalEmotionWeight = 0

            for (const [emotion] of Object.entries(happinessHandler.value)) {
                let value = happinessHandler.select(emotion).value.Value.value
                let day = happinessHandler.select(emotion).value.day ? happinessHandler.select(emotion).value.day.value : 0
                totalHappiness += emotions[emotion] * value
                totalEmotionWeight += emotions[emotion]
                happiness[emotion] = {value, emotion, day}
            }

            const happinessTotal = (totalHappiness / totalEmotionWeight) * 10

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
                cost,
                needMaxPriority,
                needs
            }

        }
    }

    // Colonists
    let citizens = nbt.select('').select('citizenManager').select('citizens')
    getCitizens(citizens, emotions);

    // Visitors
    let visitors = nbt.select('').select('visitManager').select('visitors')
    getCitizens(visitors, emotions);

    console.log(CT)
    // console.log(CT.colonists[7].skills)
    // console.log(CT.colonists[15].skills)
})

window.addEventListener('DOMContentLoaded', () => {

    const headJobs = [
        '--hap',
        '--mnr',
        'miner', 'quarrier', 'nether miner',
        '--mnr',
        '--crp',
        'lumberjack', 'fletcher', 'carpenter',
        '--crp',
        '--stn',
        'crusher', 'sifter', 'stonemason',
        '--stn',
        '--thr',
        'teacher', //'pupil',
        '--thr',
        '--hlr',
        'healer',
        '--hlr',
        '--frm',
        'farmer', 'planter', 'cowboy', 'shepherd', 'swineherd', 'rabbit herder', 'chicken farmer', 'beekeeper', 'florist', 'composter',
        '--frm',
        'baker', 'cook', 'assistant cook',
        '--frm',
        '--fhr',
        'fisherman',
        '--fhr',
        '--smt',
        'smelter', 'blacksmith',
        '--smt',
        '--sts',
        'concrete mixer', 'stone smelter', 'glassblower', 'dyer',
        '--sts',
        '--bld',
        'builder', 'mechanic',
        '--bld',
        '--alh',
        'alchemist', 'enchanter', 'researcher',
        '--alh',
        '--dlv',
        'deliveryman', 'undertaker',
        '--dlv',
        '--var',
        'knight', 'ranger', 'druid',
        '--var',
    ]
    const regex_sep = /--(\w{3})/
    const rate = [8, 2]

    const el = document.getElementById('content')
    let table = `
<table class="sortable CT_table">
    <thead>
      <tr>
        <th class="hap">gender</th>
        <th class="hap"></th>
        <th class="hap">needs</th>
        <th class="hap">happiness</th>`

    let sepSlot = ''
    for (const [k, job] of Object.entries(headJobs)) {
        let sep = regex_sep.exec(job)
        let sepClass = ''

        if (sep) {
            sepClass = 'separator'
            sepSlot = sep[1]
        }

        let thName = sep ? '' : job
        table += `<th class="${sepClass} ${sepSlot}">${thName}</th>`
    }

    table += `
</tr>
</thead>
    <tbody>`
    for (const [key] of Object.entries(CT.colonists)) {
        let col = CT.colonists[key]
        let vis = CT.colonists[key].isVisitor ? 'vis' : ''
        let gender = col.gender ? '♂' : '♀'
        let emotionTotalColor = ''
        table += `
          <td class="gender">${gender}</td>
          <td class="name ${vis}_name">${col.name}</td>`

        let trouble = ''
        // switch (true) {
        //     case col.needMaxPriority === 4: trouble = 'blocking'; break
        //     case col.needMaxPriority === 3: trouble = 'recruiticon'; break
        //     case col.needMaxPriority === 2: trouble = 'warning'; break
        //     case col.needMaxPriority === 1: trouble = 'warning'; break
        // }

        if (vis) {
            let tip = `<span class="tip">${col.cost[0]} ${col.cost[1]}</span>`
            let cost_arr = col.cost[0].split(':')
            let cost_img = `<img class="cost_icon" alt="${col.cost[0]}" src="./img/cost/${cost_arr[0]}/${cost_arr[1]}.png">`
            table += `<td class="need" data-sort="${col.needMaxPriority}">${cost_img}<span class="cost_count">${col.cost[1]}</span>${tip}</td>`
        } else {
            let need_tip = ''
            let troubles = ''
            for (const [k, need] of Object.entries(col.needs)) {

                if (col.needMaxPriority === need.priority) {
                    trouble = need.need
                }

                need_tip += need.need ? `<span>${need.need} ${need.priority} <img alt="${troubles}" src="./img/needs/${need.need}.png"></span><br>` : ''
            }
            let icon = col.needMaxPriority ? `<img alt="${trouble}" src="./img/needs/${trouble}.png">` : ''
            let tip = col.needMaxPriority ? `<span class="tip">${need_tip}</span>` : ''
            let countNeeds = Object.keys(col.needs).length > 1 ? Object.keys(col.needs).length : ''
            table += `<td class="need" data-sort="${col.needMaxPriority}">${icon}<span class="cost_count">${countNeeds}</span>${tip}</td>`
        }

        switch (true) {
            case col.happinessTotal > 8:  emotionTotalColor = 'green_icon'; break
            case col.happinessTotal === 5:  emotionTotalColor = 'blue_icon'; break
            case col.happinessTotal > 4: emotionTotalColor = 'yellow_icon'; break
            default: emotionTotalColor = 'red_icon'; break
        }
        let range = `<input type="range" id="range" disabled value="${col.happinessTotal}" min="1" max="10">`
        let emotionList = `${range} ${col.happinessTotal.toFixed(1)}<br>`
        for (const [k, emotion] of Object.entries(col.happiness)) {
            let emotionColor = ''
            switch (true) {
                case emotion.value > 1.0: emotionColor = 'green_icon'; break
                case emotion.value === 1: emotionColor = 'blue_icon'; break
                case emotion.value > 0.75: emotionColor = 'yellow_icon'; break
                default: emotionColor = 'red_icon'; break
            }

            let icon = ' <img alt="" src="./img/' + emotionColor + '.png" class="skillIcon">'
            emotionList += `<span>` + emotion.emotion + ': ' + emotion.value.toFixed(1) + icon +"</span><br>"
        }

        table += `<td class="${emotionTotalColor} s_cell" data-sort="${col.happinessTotal}"><span class="tip">${emotionList}</span></td>`


        for (const [k, job] of Object.entries(headJobs)) {
            let work = job === col.job ? 'active' : ''

            let sep = regex_sep.exec(job)
            let sepClass = ''

            if (sep) {
                sepClass = 'separator '
                sepSlot = sep[1]

                table += `<td class="${sepClass} ${sepSlot}"></td>`
            } else {
                let firstReqSkill = skillsProfessions[job][0]
                let secondReqSkill = skillsProfessions[job][1]

                let firstCurSkill = col.skills[firstReqSkill].level
                let secondCurSkill = col.skills[secondReqSkill].level

                // range 10 - 990
                let ball = firstCurSkill * rate[0] + secondCurSkill * rate[1]
                let square = 0
                switch (true) {
                    case ball<=60:  square = 0; break
                    case ball<=90:  square = 1; break
                    case ball<=140: square = 2; break
                    case ball<=190: square = 4; break
                    case ball<=290: square = 6; break
                    case ball<=390: square = 8; break
                    case ball<=550: square = 10; break
                    case ball<=700: square = 12; break
                    case ball<=990: square = 14; break
                }

                let skillList = '';
                for (const [k, skill] of Object.entries(col.skills)) {
                    let skillFirst = skill.skill === firstReqSkill ? 'first' : ''
                    let skillSecond = skill.skill === secondReqSkill ? 'second' : ''
                    let skillName = skillsLabels[skill.skill]
                    let icon = ' <img alt="" src="./img/skills/' + skillName + '.png" class="skillIcon">'
                    skillList += `<span class="${skillFirst} ${skillSecond}">` + skillsLabelsRus[skill.skill] + ': ' + skill.level + icon +"</span><br>"
                }

                table += `<td class="${work} s_cell ${sepSlot} ${vis}" data-sort="${ball}">
                        <span class="square" style="--square: ${square}px;"></span>
                        <span class="tip">${skillList}</span>
                     </td>`
            }
        }
        table += '</tr>'
    }
    table += `
    </tbody>
</table>
`
    if (el) el.innerHTML = table
})