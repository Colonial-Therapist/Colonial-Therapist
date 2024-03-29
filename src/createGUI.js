"use strict"

const SkillsProfessions = require('./skillsProfessions.js')
const skillsLabels      = require('./skillsLabels.js')
const headJobs          = require('./headJobs.js')
const Translate         = require('./translate.js')
const Config            = require("./config")
const Jaf               = require("./jaf.js")

class CrateGUI {
    static getGUI(CT) {
        const regex_sep = /--(\w{3})/
        const rate = [7, 3]
        const buildToggle = Config.toggle('notBuild') ? 'hideNotBuild' : ''
        const t_civ = !Config.toggle('civ') ? 'hideCiv' : ''
        const t_mil = !Config.toggle('mil') ? 'hideMil' : ''
        const t_unw = !Config.toggle('unw') ? 'hideUnw' : ''
        const t_vis = !Config.toggle('vis') ? 'hideVis' : ''
        let table = `
<table class="sortable CT_table ${buildToggle} ${t_civ} ${t_mil} ${t_unw} ${t_vis}">
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

        let countVacanciesWH = ''
        Object.keys(CT.factories).forEach((key) => {
            let factory = CT.factories[key].type
            let level   = CT.factories[key].level

            if (factory === 'warehouse') {
                countVacanciesWH = level * 2 - CT.factories[key].residents.length
            }

            Jaf.getVacanciesByFactory(factory, level).forEach(v => {
                v && addJod(...v)
            })
        })

        // console.log(jobBuilds)

        let sepSlot = ''
        for (const key of Object.entries(headJobs)) {
            const job = key[1]
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
            let titleVoc = Translate.text('tips.countvacancies')
            if (CT.jobs[thName]) {
                isVacancies = 'isVacancies'
                countVacancies = CT.jobs[thName]
            }

            if (thName && jobBuilds[thName] === undefined) {
                notBuilt = 'notBuilt'

                if (thName !== 'builder') {
                    countVacancies = 'X'
                    titleVoc = Translate.text('tips.notbuilt')
                }

                switch (true) {
                    // profession and research
                    case thName === 'healer' && !CT.research.includes('minecolonies:civilian/stamina'):
                    case thName === 'student' && !CT.research.includes('minecolonies:civilian/keen'):
                    case thName === 'teacher' && !CT.research.includes('minecolonies:civilian/higherlearning'):
                    case thName === 'pupil' && !CT.research.includes('minecolonies:civilian/higherlearning'):
                    case thName === 'mysticalsite' && !CT.research.includes('minecolonies:civilian/ambition'):
                    case thName === 'undertaker' && !CT.research.includes('minecolonies:civilian/remembrance'):
                    case thName === 'knight' && !CT.research.includes('minecolonies:combat/tactictraining'):
                    case thName === 'ranger' && !CT.research.includes('minecolonies:combat/tactictraining'):
                    case thName === 'druid' && !CT.research.includes('minecolonies:combat/tactictraining'):
                    case thName === 'Combat Academy' && !CT.research.includes('minecolonies:civilian/stamina'): //
                    case thName === 'Archery' && !CT.research.includes('minecolonies:civilian/stamina'): //
                    case thName === 'composter' && !CT.research.includes('minecolonies:technology/biodegradable'):
                    case thName === 'stonemason' && !CT.research.includes('minecolonies:technology/stonecake'):
                    case thName === 'sawmill' && !CT.research.includes('minecolonies:technology/woodwork'):
                    case thName === 'smelter' && !CT.research.includes('minecolonies:technology/hot'):
                    case thName === 'blacksmith' && !CT.research.includes('minecolonies:technology/hittingiron'):
                    case thName === 'florist' && !CT.research.includes('minecolonies:technology/flowerpower'):
                    case thName === 'plantation' && !CT.research.includes('minecolonies:technology/letitgrow'):
                    case thName === 'netherminer' && !CT.research.includes('minecolonies:technology/opennether'):
                    case thName === 'crusher' && !CT.research.includes('minecolonies:technology/rockingroll'):
                    case thName === 'fletcher' && !CT.research.includes('minecolonies:technology/stringwork'):
                    case thName === 'sifter' && !CT.research.includes('minecolonies:technology/Sieving'):
                    case thName === 'stonesmeltery' && !CT.research.includes('minecolonies:technology/theflintstones'):
                    case thName === 'glassblower' && !CT.research.includes('minecolonies:technology/thoselungs'):
                    case thName === 'mechanic' && !CT.research.includes('minecolonies:technology/whatyaneed'):
                    case thName === 'dyer' && !CT.research.includes('minecolonies:technology/rainbowheaven'):
                    case thName === 'alchemist' && !CT.research.includes('minecolonies:technology/alchemist'):
                    case thName === 'concretemixer' && !CT.research.includes('minecolonies:technology/pavetheroad'):
                        countVacancies = '?'
                        notBuilt += ' notResearch'
                        titleVoc = Translate.text('tips.notresearch')
                }
            }

            let titleWH = Translate.text('tips.warehousevacancies')
            let WH = countVacanciesWH && thName === 'deliveryman' ? `<span class="countVacWH" title="${titleWH}"> → ${countVacanciesWH}</span>` : ''
            thName = thName ? Translate.text(`jobs.${thName}`) : ''

            table += `<th class="${sepClass} ${sepSlot} ${isVacancies} ${notBuilt}">${thName}<span class="countVac" title="${titleVoc}">${countVacancies}${WH}</span></th>`
        }

        table += `
</tr>
</thead>
    <tbody>`
        for (const [key] of Object.entries(CT.colonists)) {
            let col = CT.colonists[key]
            let vis = ''
            let child = CT.colonists[key].isChild ? 'child' : ''
            let gender = col.gender ? '♂' : '♀'
            let emotionTotalColor = ''
            let noJob = ''
            let mil = ''
            let civ = ''

            switch (true) {
                case (!!CT.colonists[key].isVisitor): vis = 'vis'; break;
                case (col.isWarrior): mil = 'mil'; break;
                case (!col.job || col.job === 'student'): noJob = 'noJob'; civ = 'civ'; break;
                default: civ = 'civ';
            }

            table += `<tr class="${civ} ${vis} ${child} ${noJob} ${mil}">
          <td class="gender">${gender}</td>
          <td class="name ${vis} ${child} ${noJob}">${col.name}</td>`

            let trouble = ''

            if (vis) {
                let tip = `<span class="tip">${col.cost[0]} ${col.cost[1]}</span>`
                let cost_arr = col.cost[0].split(':')
                let cost_img = `<img class="cost_icon" alt="${col.cost[0]}" src="./img/cost/${cost_arr[0]}/${cost_arr[1]}.png">`
                table += `<td class="need" data-sort="${col.needMaxPriority}">${cost_img}<span class="cost_count">${col.cost[1]}</span>${tip}</td>`
            } else {
                let need_tip = ''
                let troubles = ''
                for (const key of Object.entries(col.needs)) {
                    const need = key[1]
                    if (col.needMaxPriority === need.priority) {
                        trouble = need.need
                    }
                    const tNeed = Translate.text(`needs.${need.need}`)
                    need_tip += need.need ? `<span>${tNeed} <img alt="${troubles}" src="./img/needs/${need.need}.png"></span><br>` : ''
                }
                let icon = col.needMaxPriority >= 0 ? `<img class="need_icon" alt="${trouble}" src="./img/needs/${trouble}.png">` : ''
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
            let range = `<input type="range" disabled value="${col.happinessTotal}" min="1" max="10">`
            let emotionList = `${range} ${col.happinessTotal.toFixed(1)}<br>`
            for (const key of Object.entries(col.happiness)) {
                const emotion = key[1]
                let emotionColor = ''
                switch (true) {
                    case emotion.value > 1.0: emotionColor = 'green_icon'; break
                    case emotion.value === 1: emotionColor = 'blue_icon'; break
                    case emotion.value > 0.75: emotionColor = 'yellow_icon'; break
                    default: emotionColor = 'red_icon'; break
                }

                let icon = ' <img alt="" src="./img/' + emotionColor + '.png" class="skillIcon">'
                emotionList += `<span>` + Translate.text(`happiness.${emotion.emotion}`) + ': '
                    + emotion.value.toFixed(1) + icon +"</span><br>"
            }

            table += `<td class="${emotionTotalColor} s_cell" data-sort="${col.happinessTotal}"><span class="tip">${emotionList}</span></td>`


            for (const key of Object.entries(headJobs)) {
                const job = key[1]
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
                    let secondCurSkill = secondReqSkill !== null ? col.skills[secondReqSkill].level : 0

                    // range 10 - 990
                    let ball = firstCurSkill * rate[0] + secondCurSkill * rate[1]
                    let square = 0
                    let diamond = ''
                    switch (true) {
                        case ball<=60:  square = 0; break
                        case ball<=90:  square = 1; break
                        case ball<=140: square = 2; break
                        case ball<=190: square = 4; break
                        case ball<=290: square = 6; break
                        case ball<=390: square = 8; break
                        case ball<=550: square = 10; break
                        case ball<=700: square = 12; break
                        case ball<990: square = 14; break
                        case ball===990: square = 14; diamond = 'diamond'; break
                    }

                    let skillList = '';
                    for (const key of Object.entries(col.skills)) {
                        const skill = key[1]
                        let skillFirst = skill.skill === firstReqSkill ? 'first' : ''
                        let skillSecond = skill.skill === secondReqSkill ? 'second' : ''
                        let skillName = skillsLabels[skill.skill].toLowerCase()
                        let icon = ' <img alt="" src="./img/skills/' + skillName + '.png" class="skillIcon">'
                        skillList += `<span class="${skillFirst} ${skillSecond}">`
                            + Translate.text(`skills.${skill.skill}`) + ': ' + skill.level + icon +"</span><br>"
                    }

                    const  isVacancies = CT.jobs[job] ? 'isVacancies' : ''

                    let  notBuilt = ''
                    if (job && jobBuilds[job] === undefined) {
                        notBuilt = 'notBuilt'
                    }

                    table += `<td class="${work} s_cell ${sepSlot} ${vis} ${child} ${isVacancies} ${notBuilt}" data-sort="${ball}">
                        <span class="square ${diamond}" style="--square: ${square}px;"></span>
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
        let checked = Config.toggle('notBuild') ? 'checked' : ''
        let toggle = `<label class="switch" for="notBuild" title="`+ Translate.text("tips.hidenotbuilt") +`">
                          <input type="checkbox" id="notBuild" ${checked}/>
                          <div class="slider round"></div>
                      </label>`

        let civ = 0
        let civMax = 0
        let citLimit = 25
        let wars = 0
        let unWork = 0
        let vis = 0

        for (let key of Object.entries(CT.colonists)) {
            let col = key[1]
            switch (true) {
                case (col.isWarrior): ++wars; break;
                case (col.isVisitor === 1): ++vis; break;
                case (!col.job || col.job === 'student'): ++unWork; ++civ; break;
                default: ++civ
            }
        }

        for (let key of Object.entries(CT.homes)) {
            let home = key[1]
            if (home.type === 'tavern' && home.level > 0) {
                civMax += 4
            }
            if (home.type === 'home' && home.level > 0) {
                civMax += home.level
            }
        }

        if (CT.research.includes('minecolonies:civilian/outpost')) {
            citLimit = 50
        }

        if (CT.research.includes('minecolonies:civilian/hamlet')) {
            citLimit = 100
        }

        let warsMax = wars + (CT.jobs.knight > 0 ? CT.jobs.knight : 0)
        let cit = civ + wars
        let citMax = civMax + warsMax
        let citAva  = citMax <= citLimit ? citMax : citLimit

        let needs = `
<div class="c_needs wsn">
  `+ Translate.text(`gui.needs`) +`:
  <span class="need4">${CT.needs[4] ? CT.needs[4] : 0}</span> | 
  <span class="need3">${CT.needs[3] ? CT.needs[3] : 0}</span> | 
  <span class="need2">${CT.needs[2] ? CT.needs[2] : 0}</span> | 
  <span class="need1">${CT.needs[1] ? CT.needs[1] : 0}</span> |
  <span class="need1">${CT.needs[1] ? CT.needs[1] : 0}</span> |
  <span class="need0">${CT.needs[0] ? CT.needs[0] : 0}</span>
</div>`

        let c_civ = Config.toggle('civ') ? 'checked' : ''
        let c_mil = Config.toggle('mil') ? 'checked' : ''
        let c_unw = Config.toggle('unw') ? 'checked' : ''
        let c_vis = Config.toggle('vis') ? 'checked' : ''

        let citizens = `
<div class="c_citizens">
  <span class="wsn">`+ Translate.text(`gui.all`) +`: <span>${cit}</span>/<span title="${citMax}">${citAva}</span></span>
  <label class="wsn"><input id="civ" type="checkbox" ${c_civ}>`+ Translate.text(`gui.civilians`) +`: <span class="t_col">${civ}</span>/<span class="t_colMax">${civMax}</span></label>
  <label class="wsn"><input id="mil" type="checkbox" ${c_mil}>`+ Translate.text(`gui.militia`) +`: <span class="t_mil">${wars}</span>/<span class="t_milMax">${warsMax}</span></label>
  <label class="wsn"><input id="unw" type="checkbox" ${c_unw}>`+ Translate.text(`gui.unemployed`) +`: <span class="t_unw">${unWork}</span></label>
  <label class="wsn"><input id="vis" type="checkbox" ${c_vis}>`+ Translate.text(`gui.visitors`) +`: <span class="t_vis">${vis}</span></label>
</div>`

        let counters = `${toggle}<div class="counters"> ${needs} ${citizens}</div>`

        return counters + table
    }
}

module.exports = CrateGUI