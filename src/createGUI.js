"use strict"

const SkillsProfessions = require('./skillsProfessions.js')
const skillsLabels = require('./skillsLabels.js')
const Translate = require('./translate.js')

class CrateGUI {
    static getGUI(CT) {
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

        let table = `
<table class="sortable CT_table">
    <thead>
      <tr>
        <th class="hap">`+ Translate.text(`gui.gender`) +`</th>
        <th class="hap"></th>
        <th class="hap">`+ Translate.text(`gui.needs`) +`</th>
        <th class="hap">`+ Translate.text(`gui.happiness`) +`</th>`

        let jobBuilds = []

        function addJod(job) {
            if (job) {
                jobBuilds[job] = jobBuilds[job] ? ++jobBuilds[job] : 1
            }
        }

        Object.keys(CT.factories).forEach((key) => {
            let job   = CT.factories[key].type
            let level = CT.factories[key].level

            job = job === 'hospital' ? 'healer' : job
            job = job === 'university' ? 'researcher' : job
            job = job === 'cook' && level > 2 ? 'cook assistant' : job
            job = job === 'smeltery' ? 'smelter' : job

            if (level) {
                switch (true) {
                    case (['barracks', 'guardtower'].indexOf(job) > -1):
                        addJod('knight')
                        addJod('ranger')
                        addJod('druid')
                        break
                    default:
                        addJod(job)
                }
            }
        })

        // console.log(jobBuilds)

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
            let notBuilt = ''
            let countVacancies = ''
            if (CT.jobs[thName]) {
                isVacancies = 'isVacancies'
                countVacancies = CT.jobs[thName]
            }

            if (thName && jobBuilds[thName] === undefined) {
                notBuilt = 'notBuilt'
                countVacancies = 'X'
            }

            thName = thName ? Translate.text(`jobs.${thName}`) : ''

            table += `<th class="${sepClass} ${sepSlot} ${isVacancies} ${notBuilt}">${thName}<span class="countVac">${countVacancies}</span></th>`
        }

        table += `
</tr>
</thead>
    <tbody>`
        for (const [key] of Object.entries(CT.colonists)) {
            let col = CT.colonists[key]
            let vis = CT.colonists[key].isVisitor ? 'vis' : ''
            let child = CT.colonists[key].isChild ? 'child' : ''
            let gender = col.gender ? '♂' : '♀'
            let emotionTotalColor = ''
            table += `
          <td class="gender">${gender}</td>
          <td class="name ${vis} ${child}">${col.name}</td>`

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
                let cost_img = `<img class="cost_icon" alt="${col.cost[0]}" src="./src/img/cost/${cost_arr[0]}/${cost_arr[1]}.png">`
                table += `<td class="need" data-sort="${col.needMaxPriority}">${cost_img}<span class="cost_count">${col.cost[1]}</span>${tip}</td>`
            } else {
                let need_tip = ''
                let troubles = ''
                for (const [k, need] of Object.entries(col.needs)) {

                    if (col.needMaxPriority === need.priority) {
                        trouble = need.need
                    }
                    const tNeed = Translate.text(`needs.${need.need}`)
                    need_tip += need.need ? `<span>${tNeed} <img alt="${troubles}" src="./src/img/needs/${need.need}.png"></span><br>` : ''
                }
                let icon = col.needMaxPriority >= 0 ? `<img class="need_icon" alt="${trouble}" src="./src/img/needs/${trouble}.png">` : ''
                let tip = col.needMaxPriority >= 0 ? `<span class="tip">${need_tip}</span>` : ''
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

                let icon = ' <img alt="" src="./src/img/' + emotionColor + '.png" class="skillIcon">'
                emotionList += `<span>` + Translate.text(`happiness.${emotion.emotion}`) + ': '
                    + emotion.value.toFixed(1) + icon +"</span><br>"
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
                    let firstReqSkill = SkillsProfessions[job][0]
                    let secondReqSkill = SkillsProfessions[job][1]

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
                        let skillName = skillsLabels[skill.skill].toLowerCase()
                        let icon = ' <img alt="" src="./src/img/skills/' + skillName + '.png" class="skillIcon">'
                        skillList += `<span class="${skillFirst} ${skillSecond}">`
                            + Translate.text(`skills.${skill.skill}`) + ': ' + skill.level + icon +"</span><br>"
                    }

                    const  isVacancies = CT.jobs[job] ? 'isVacancies' : ''

                    let  notBuilt = ''
                    if (job && jobBuilds[job] === undefined) {
                        notBuilt = 'notBuilt'
                    }

                    table += `<td class="${work} s_cell ${sepSlot} ${vis} ${child} ${isVacancies} ${notBuilt}" data-sort="${ball}">
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
        let civ = 0
        let wars = 0
        let unWork = 0
        let vis = 0

        for (let [k, col] of Object.entries(CT.colonists)) {
            switch (true) {
                case (col.isWarrior): ++wars; break;
                case (col.isVisitor === 1): ++vis; break;
                case (!col.job): ++unWork; ++civ; break;
                default: ++civ
            }
        }

        let needs = `
<div class="c_needs">
  `+ Translate.text(`gui.needs`) +`:
  <span class="need4">${CT.needs[4] ? CT.needs[4] : 0}</span> / 
  <span class="need3">${CT.needs[3] ? CT.needs[3] : 0}</span> / 
  <span class="need2">${CT.needs[2] ? CT.needs[2] : 0}</span> / 
  <span class="need1">${CT.needs[1] ? CT.needs[1] : 0}</span> /
  <span class="need0">${CT.needs[0] ? CT.needs[0] : 0}</span>
</div>`
        let citizens = `
<div class="c_citizens">
  `+ Translate.text(`gui.civilians`) +`: <span class="t_col">${civ}</span>
  `+ Translate.text(`gui.militia`) +`: <span class="t_mil">${wars}</span>
  `+ Translate.text(`gui.unemployed`) +`: <span class="t_unw">${unWork}</span>
  `+ Translate.text(`gui.visitors`) +`: <span class="t_vis">${vis}</span>
</div>`

        let counters = `<div class="counters">${needs} ${citizens}</div>`

        return counters + table
    }
}

module.exports = CrateGUI