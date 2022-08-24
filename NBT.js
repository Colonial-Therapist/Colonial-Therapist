"use strict";

class NBT {
    constructor(nbt) {
        if (nbt) {
            this.root = nbt
        } else {
            this.root = {}
        }
    }

    /**
     * Select a tag
     * @param {string} tagName the tag name in root
     * @return {NBT|null}
     */
    get(tagName) {
        if (tagName) {
            if (tagName in this.root) {
                if ('value' in this.root[tagName]) {
                    // console.log(Object.is(this.root[tagName].value))
                    // console.log(typeof this.root[tagName].value)
                    // console.log(this.root[tagName].value)
                    if (typeof this.root[tagName].value === 'object') {
                    // console.log(222)
                    //     let res = Object.assign(new NBT(), this.root[tagName].value)
                    //     delete res.root;
                        return Object.assign(new NBT(), this.root[tagName].value)
                    } else {
                        return this.root[tagName].value
                    }
                }
            }
        } else {
            if ('value' in this.root) {
                return new NBT(this.root.value)
            }
        }

        if (tagName) {
            if ('value' in this[tagName]) {
                if (typeof this[tagName].value === 'object') {
                    return Object.assign(new NBT(), this[tagName].value)
                } else {
                    return this[tagName].value
                }
            }
        }

        return null
    }

    select(tagName) {
        return this.get(tagName)
    }
}

module.exports = NBT;