// window.addEventListener('DOMContentLoaded', () => {
//
// })

const fs = require('fs')
const NBT = require('./NBT.js')
const nbt_data = require('prismarine-nbt')
const path = require("path");

// const datFile = path.join(__dirname, 'data/capabilities.dat')
const datFile = path.join('C:/Users/s_kus/AppData/Roaming/.curseforge/Instances/MineColonies Official/saves/-_-/data/capabilities.dat')

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
    colonists: {},
    jobs     : [],
    needs    : [0, 0, 0, 0]
}

fs.readFile(datFile, function (err, data) {
    if (err) return console.error(err)
    nbt_data.parse(data, function (error, data) {
        const nbt = new NBT(data)
        console.log(nbt)
        const colonies = nbt.get('').get('data').get('minecolonies:colonymanager').get('colonies').value[0]

        // Builds
        const buildings = new NBT(colonies).get('buildingManager').get('buildings')
        // buildingManager
        // console.log(buildings.value)
        // console.log(buildings.get('0').value)
        for (const [key, build] of Object.entries(buildings.value)) {
            const type = build.type.value.replace("minecolonies:", "")
            let name = build.customName.value ? build.customName.value : type
            const level = build.level.value
            const homes = ['home', 'tavern']

            if (homes.indexOf(type) > -1) {
                CT.homes[key] = {type, name, level, key}
            } else {
                CT.factories[key] = {type, name, level, key}

                let vacancies = 1

                name = name === 'quarrier' ? 'miner' : name
                name = name === 'university' ? 'researcher' : name
                name = name === 'hospital' ? 'healer' : name

                if (name === 'guardtower') {
                    name = 'knight'
                    vacancies = 1 * level
                }

                if (name === 'barracks') {
                    name = 'knight'
                    vacancies = 1 * level
                }

                if (skillsProfessions.hasOwnProperty(name) && level > 0) {
                    CT.jobs[name] = CT.jobs[name] ? ++CT.jobs[name] : 1
                }


            }
        }
        CT.jobs['quarrier'] = CT.jobs['miner']

        CT.jobs['ranger'] = CT.jobs['knight']
        CT.jobs['druid'] = CT.jobs['knight']

        function getCitizens(citizens, emotions) {
            // console.log(citizens)
            // console.log(citizens.get('5').value)
            for (let [key, citizen] of Object.entries(citizens.value)) {
                citizen = new NBT(citizen)
                const rcost = citizen.root.rcost ? citizen.get('rcost') : ''
                const chatoptions = citizen.get('chatoptions')
                let isVisitor = 0
                let cost = []
                const name = citizen.get('name')
                const warriors = ['ranger', 'knight', 'druid']
                const job = citizen.root.job ? citizen.get('job').get('type').replace("minecolonies:", "") : null
                const isWarrior = warriors.indexOf(job) > -1
                const mourning = citizen.get('mourning')
                const id = citizen.get('id')
                const newSkills = citizen.get('newSkills') ? citizen.get('newSkills').get('levelMap') : ''
                const happinessHandler = citizen.get('happinessHandler')
                const gender = citizen.get('female') ? 0 : 1
                const skills = {}
                const happiness = {}
                let needMaxPriority = 0
                const needs = {}

                if (rcost) {
                    isVisitor = 1;
                    cost = [rcost.get('id'), rcost.get('Count')]
                }

                for (let [k] of Object.entries(chatoptions.value)) {
                    let chatoption = new NBT(chatoptions.value[k]).get('chatoption')
                    let priority = chatoption.get('priority')
                    let inquiry = JSON.parse(chatoption.get('inquiry'))
                    let translate = inquiry.translate
                    let translate_reg = /.*\.(\D*)\d*$/
                    let need = translate_reg.exec(translate)[1]
                    needMaxPriority = needMaxPriority > priority ? needMaxPriority : priority
                    needs[k] = {priority, need, inquiry}
                    if (!isVisitor) {
                        CT.needs[priority] = CT.needs[priority] ? ++CT.needs[priority] : 1
                    }
                }

                for (const [k] of Object.entries(newSkills.value)) {
                    let newSkill = new NBT(newSkills.value[k])
                    let experience = newSkill.get('experience')
                    let level = newSkill.get('level')
                    let skill = newSkill.get('skill')

                    skills[skill] = {skill, level, experience}
                }

                let totalHappiness = 0
                let totalEmotionWeight = 0

                for (const [emotion] of Object.entries(happinessHandler)) {
                    if (emotion !== 'root') {
                        let value = happinessHandler.get(emotion).get('Value')
                        let day = happinessHandler.get(emotion).day ? happinessHandler.get(emotion).get('day') : 0
                        totalHappiness += emotions[emotion] * value
                        totalEmotionWeight += emotions[emotion]
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
                    cost,
                    needMaxPriority,
                    needs
                }
            }
        }

        // Colonists
        const citizens = new NBT(colonies).get('citizenManager').get('citizens')
        getCitizens(citizens, emotions);

        // Visitors
        const visitors = new NBT(colonies).get('visitManager').get('visitors')
        getCitizens(visitors, emotions);
        // console.log(CT)
        // console.log(CT.colonists[7].skills)
        // console.log(CT.colonists[15].skills)
    })
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

        let isVacancies = ''
        let countVacancies = ''
        if (CT.jobs[thName]) {
            isVacancies = 'isVacancies'
            countVacancies = CT.jobs[thName]
        }

        table += `<th class="${sepClass} ${sepSlot} ${isVacancies}">${thName}<span class="countVac">${countVacancies}</span></th>`
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
            let icon = col.needMaxPriority ? `<img class="need_icon" alt="${trouble}" src="./img/needs/${trouble}.png">` : ''
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

                const  isVacancies = CT.jobs[job] ? 'isVacancies' : ''

                table += `<td class="${work} s_cell ${sepSlot} ${vis} ${isVacancies}" data-sort="${ball}">
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
    let cols = 0
    let wars = 0
    let unWork = 0
    let vis = 0

    for (let [k, col] of Object.entries(CT.colonists)) {
        switch (true) {
            case (col.isWarrior): ++wars; break;
            case (col.isVisitor === 1): ++vis; break;
            case (!col.job): ++unWork; ++cols; break;
            default: ++cols
        }
    }

    let needs = `
<div class="c_needs">
  Needs: 
  <span class="need4">${CT.needs[4]}</span> / 
  <span class="need3">${CT.needs[3]}</span> / 
  <span class="need2">${CT.needs[2]}</span> / 
  <span class="need1">${CT.needs[1]}</span> /
  <span class="need0">${CT.needs[0]}</span>
</div>`
    let citizens = `
<div class="c_citizens">
  Colonists: <span class="t_col">${cols}</span>
  Militia: <span class="t_mil">${wars}</span>
  Unemployed: <span class="t_unw">${unWork}</span>
  Visitors: <span class="t_vis">${vis}</span>
</div>`

    let counters = `<div class="counters">${needs} ${citizens}</div>`
    if (el) el.innerHTML = counters + table
})