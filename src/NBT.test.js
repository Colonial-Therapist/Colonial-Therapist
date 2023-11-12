const NBT   = require('./NBT.js')

const data = {
    "type" : "compound",
    "value": {
        "data": {
            "type" : "compound",
            "value": {
                "obj"        : {
                    "type" : "int",
                    "value": 1
                },
                "objarr": {
                    "type": "list",
                    "value": {
                        "type": "end",
                        "value": []
                    }
                },
                "inVal"      : {
                    "type" : "compound",
                    "value": {
                        "Value": {
                            "type" : "double",
                            "value": 1
                        },
                        "day"  : {
                            "type" : "int",
                            "value": 0
                        }
                    }
                },
                "notVal": {
                    "type" : "compound",
                    "value": {
                        "Value": {
                            "type" : "double",
                            "notValue": 2
                        },
                        "day"  : {
                            "type" : "int",
                            "value": 0
                        }
                    }
                }
            }
        }
    }
}

describe('get root', () => {
    test('return data by empty object', () => {
        let nbt = new NBT({"value": {"type": "string","value": "true"}})
        expect(nbt.get('').hasOwnProperty('root')).toEqual(true)
    })

    test('return NBT by field object', () => {
        let nbt = new NBT({"value": {"type": "compound","value": {}}})
        expect(typeof nbt.get('').get('root')).toEqual("object")
    })
})

describe('valid result', () => {
    test('return value by field name', () => {
        let nbt = new NBT({"field": {"type": "string","value": "false"}})
        expect(nbt.get('field')).toEqual("false")
    })

    test('returns value after two nestings', () => {
        let nbt = new NBT(data)
        expect(nbt.get('').get('data').get('obj')).toEqual(1)
    })

    test('return object by field name', () => {
        let nbt = new NBT(data)
        expect(nbt.get('').get('data').get('objarr')).toMatchObject({
            "type": "end",
            "value": []
        })
    })

    test('returns value from "Value"', () => {
        let nbt = new NBT(data)
        expect(nbt.get('').get('data').get('inVal').get('Value')).toEqual(1)
    })
})

describe('borderline outcomes', () => {
    test('return null if passed an empty object', () => {
        let nbt = new NBT({})
        expect(nbt.get('')).toBeNull()
    })

    test('returns an error if it does not find "value"', () => {
        let nbt = new NBT({"field": {"type": "string","notValue": "false"}})
        expect(nbt.get('field')).toEqual(new TypeError('notValue'))
    })

    test('returns an error if it does not find "value" 2', () => {
        let nbt = new NBT(data)
        expect(nbt.get('').get('data').get('notVal').get('Value')).toEqual(new TypeError('notValue'))
    })
})