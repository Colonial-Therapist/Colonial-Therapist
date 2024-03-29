"use strict"

const headJobs = require('./headJobs.js')
const Jaf      = require('./jaf.js')

class CreateMap {
    //TODO reactor
    static factoryGroups(factory) {
        const regex_sep = /(--\w{3})/
        let prevSep     = ''

        for (const job of headJobs) {
            let sep = regex_sep.exec(job)

            if (sep) {
                prevSep = sep[1]
            }

            if (job === Jaf.getFirstJobByFactory(factory)) {
                return prevSep
            }
        }

        return '--hap'
    }

    static createSvgElement(tagName) {
        return document.createElementNS('http://www.w3.org/2000/svg', tagName)
    }

    static setAttributes(element, attributes) {
        Object.keys(attributes).forEach(key => {
            element.setAttribute(key, attributes[key])
        })
    }

    static createPath() {
        const el = this.createSvgElement('path')
        this.setAttributes(el, {
            'stroke'      : '#000000',
            'stroke-width': '2',
            fill          : 'none',
        })
        return el
    }

    static createRect(minX, minY, maxX, maxY, fill, stroke) {
        const el = this.createSvgElement('rect')
        this.setAttributes(el, {
            'x'           : minX,
            'y'           : minY,
            'width'       : maxX - minX,
            'height'      : maxY - minY,
            'stroke'      : stroke,
            'stroke-width': '0.5',
            fill          : fill,
        })
        return el
    }

    static createCircle(x, y, fill, r) {
        const el = this.createSvgElement('circle')
        this.setAttributes(el, {
            'stroke'      : '#000000',
            'stroke-width': '0.2',
            'cx'          : x,
            'cy'          : y,
            'r'           : r,
            fill          : fill,
        })
        return el
    }

    static createText(name, x, y, dy) {
        const el          = this.createSvgElement('text')
        el.innerHTML      = name
        el.style.fontSize = '4px'
        this.setAttributes(el, {
            'x'          : x,
            'y'          : y,
            'dy'         : dy,
            'text-anchor': 'middle',
        })
        return el
    }

    static createLine(x1, y1, x2, y2, stroke) {
        const el = this.createSvgElement('line')
        this.setAttributes(el, {
            'x1'    : x1,
            'y1'    : y1,
            'x2'    : x2,
            'y2'    : y2,
            'stroke': stroke,
        })
        return el
    }

    static randomIntFromInterval(min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    static createArc(x1, y1, x2, y2, stroke) {
        const el = this.createSvgElement('path')
        const r  = this.randomIntFromInterval(-10, 10)
        this.setAttributes(el, {
            'd'     : `M${x1} ${y1} C ${x1} ${y1} ${x2 + r} ${y2 + r} ${x2} ${y2}`,
            'stroke': stroke,
            'fill'  : 'none',
        })
        return el
    }

    static createBuild(svg, name, x, y, fill, minX, minY, maxX, maxY, level, id, stroke, type) {
        const centerX = minX + ((maxX - minX) / 2)
        const centerY = minY + ((maxY - minY) / 2)

        const f = this.createRect(minX, minY, maxX, maxY, '#fff', '#fff')
        const r = this.createRect(minX, minY, maxX, maxY, fill, stroke)
        const c = this.createCircle(x, y, fill, 0.8)
        const t = this.createText(name, centerX, centerY, 3)
        const l = this.createText(level, centerX, centerY, 0)
        const b = this.createSvgElement('g')
        const h = this.createRect(minX, minY, maxX, maxY, '#00000000', '#00000000')

        h.dataset.idBuild = id
        h.classList.add('bh')
        b.classList.add(type)

        b.appendChild(f)
        b.appendChild(r)
        b.appendChild(c)
        b.appendChild(t)
        b.appendChild(l)
        b.appendChild(h)

        svg.appendChild(b)
    }

    static create(CT) {
        const map   = document.getElementById('map')
        const field = document.createElement('div')
        const svg   = this.createSvgElement('svg')
        const wrapper   = this.createSvgElement('g')
        const builds   = this.createSvgElement('g')
        const colonists   = this.createSvgElement('g')
        const lines   = this.createSvgElement('g')

        svg.style.border = '1px solid #000000'

        builds.classList.add('builds')
        colonists.classList.add('colonists')
        lines.classList.add('lines')

        svg.appendChild(wrapper)
        wrapper.appendChild(builds)
        wrapper.appendChild(colonists)
        wrapper.appendChild(lines)

        const h = CT.map.maxX - CT.map.minX
        const w = CT.map.maxZ - CT.map.minZ
        const o = 5

        this.setAttributes(svg, {
            width  : '100%',
            height : '100%',
            viewBox: `${CT.map.minX - o} ${CT.map.minZ - o} ${h + o * 2} ${w + o * 2}`
        })

        Object.keys(CT.factories).forEach(key => {
            const x     = CT.factories[key].coordinates.location.x
            const z     = CT.factories[key].coordinates.location.z
            const minX  = CT.factories[key].coordinates.corner1.x
            const minZ  = CT.factories[key].coordinates.corner1.z
            const maxX  = CT.factories[key].coordinates.corner2.x
            const maxZ  = CT.factories[key].coordinates.corner2.z
            const name  = CT.factories[key].name
            const type  = CT.factories[key].type
            const level = CT.factories[key].level
            let stroke  = level ? 'black' : 'grey'

            if (['barrackstower', 'guardtower'].indexOf(type) > -1) {
                let r = 0
                switch (true) {
                    case (level === 1) : r = 80;  break;
                    case (level === 2) : r = 110; break;
                    case (level === 3) : r = 140; break;
                    case (level === 4) : r = 170; break
                    case (level === 5) : r = 200; break;
                }

                const a = this.createCircle(x, z, 'rgba(0, 0, 255, 0.05)', r)

                a.dataset.idBuild = key
                a.style.display   = 'none'
                svg.appendChild(a)

                const res      = CT.factories[key].residents.length
                const maxRes   = type === 'guardtower' ? 1 : level
                const freeBeds = maxRes - res
                stroke         = freeBeds ? 'blue' : 'black'
            }

            const group = this.factoryGroups(type)

            this.createBuild(builds, name, x, z, `rgba(var(${group}-rgb),0.${Math.round(level*1.8)})`, minX, minZ, maxX, maxZ, level, key, stroke, type)

            if (CT.factories[key].residents) {
                CT.factories[key].residents.forEach((id) => {
                    const x2 = CT.colonists[id].pos.x
                    const z2 = CT.colonists[id].pos.z

                    const stroke = 'darkblue'
                    const l = this.createArc(x, z, x2, z2, stroke)

                    l.dataset.idBuild = key
                    l.dataset.idCol   = id
                    l.style.display   = "none"

                    lines.appendChild(l)
                })
            }

        })

        Object.keys(CT.homes).forEach(key => {
            const x     = CT.homes[key].coordinates.location.x
            const z     = CT.homes[key].coordinates.location.z
            const minX  = CT.homes[key].coordinates.corner1.x
            const minZ  = CT.homes[key].coordinates.corner1.z
            const maxX  = CT.homes[key].coordinates.corner2.x
            const maxZ  = CT.homes[key].coordinates.corner2.z
            const name  = CT.homes[key].name
            const type  = CT.homes[key].type
            const level = CT.homes[key].level
            let stroke  = level ? 'grey' : 'black'

            if (CT.homes[key].residents) {
                const res      = CT.homes[key].residents.length
                const maxRes   = type === 'tavern' ? 4 : level
                const freeBeds = maxRes - res
                stroke         = freeBeds ? 'green' : 'black'
            }

            this.createBuild(builds, name, x, z, `rgba(0,128,0,0.${Math.round(level*1.8)})`, minX, minZ, maxX, maxZ, level, key, stroke, type)

            if (CT.homes[key].residents) {
                CT.homes[key].residents.forEach((id) => {
                    const x2 = CT.colonists[id].pos.x
                    const z2 = CT.colonists[id].pos.z

                    let stroke = 'black'
                    const g    = Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(z2 - z, 2))

                    switch (true) {
                        case (g <= 30)          : stroke = 'green';  break;
                        case (g > 30 && g < 60) : stroke = 'yellow'; break;
                        case (g >= 60)          : stroke = 'red';    break;
                    }

                    const l = this.createArc(x, z, x2, z2, stroke)

                    l.dataset.idBuild = key
                    l.dataset.idCol   = id
                    l.style.display   = "none"

                    lines.appendChild(l)
                })
            }
        })

        Object.keys(CT.colonists).forEach(key => {
            const x    = CT.colonists[key].pos.x
            const z    = CT.colonists[key].pos.z
            const name = CT.colonists[key].name
            const id   = CT.colonists[key].id
            const job  = CT.colonists[key].job

            let fill = 'yellow';
            switch (true) {
                case (job === 'builder')     : fill = 'green';     break;
                case (job === 'deliveryman') : fill = 'red';       break;
                case (job === 'knight')      : fill = 'blue';      break;
                case (job === 'ranger')      : fill = 'lightblue'; break;
                case (job === 'druid')       : fill = 'darkblue';  break;
            }

            const c = this.createCircle(x, z, fill, 1.5)
            const t = this.createText(name, x, z, 5.5)

            c.dataset.idCol = id
            c.style.display = "none"
            t.dataset.idCol = id
            t.style.display = "none"

            colonists.appendChild(c)
            colonists.appendChild(t)
        })

        field.appendChild(svg)
        map.innerHTML = field.outerHTML
    }
}

module.exports = CreateMap