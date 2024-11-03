const NBT = require('./NBT.js')

const data = {
    type : "compound",
    value: {
        data: {
            type : "compound",
            value: {
                obj   : {type: "int", value: 1},
                objarr: {type: "list", value: {type: "end", value: []}},
                inVal : {
                    type : "compound",
                    value: {Value: {type: "double", value: 1}, day: {type: "int", value: 0}}
                },
                notVal: {
                    type : "compound",
                    value: {Value: {type: "double", notValue: 2}, day: {type: "int", value: 0}}
                }
            }
        }
    }
}

describe('NBT Class - Basic Cases', () => {
    test('Returns NBT instance for root data when empty object is passed', () => {
        let nbt = new NBT({value: {type: "string", value: "true"}})
        expect(nbt.get('').hasOwnProperty('root')).toEqual(true)
    })

    test('Returns NBT instance for nested empty object field', () => {
        let nbt = new NBT({value: {type: "compound", value: {}}})
        expect(nbt.get('')).toBeInstanceOf(NBT)
        expect(nbt.get('').get('').root).toEqual({})
    })
})

describe('NBT Class - Valid Results', () => {
    test('Returns value by field name', () => {
        let nbt = new NBT({field: {type: "string", value: "false"}})
        expect(nbt.get('field')).toEqual("false")
    })

    test('Returns value after two levels of nesting', () => {
        let nbt = new NBT(data)
        expect(nbt.get('').get('data').get('obj')).toEqual(1)
    })

    test('Returns nested object by field name', () => {
        let nbt = new NBT(data)
        expect(nbt.get('').get('data').get('objarr')).toMatchObject({
            type : "end",
            value: []
        })
    })

    test('Returns deeply nested value from "Value" field', () => {
        let nbt = new NBT(data)
        expect(nbt.get('').get('data').get('inVal').get('Value')).toEqual(1)
    })
})

describe('NBT Class - Borderline Outcomes', () => {
    test('Returns null for empty object root', () => {
        let nbt = new NBT({})
        expect(nbt.get('')).toBeNull()
    })

    test('Returns error if "value" not found in tag', () => {
        let nbt = new NBT({field: {type: "string", notValue: "false"}})
        expect(nbt.get('field')).toEqual(new Error('notValue'))
    })

    test('Returns error for deeply nested missing "value"', () => {
        let nbt = new NBT(data)
        expect(nbt.get('').get('data').get('notVal').get('Value')).toEqual(new Error('notValue'))
    })

    test('Returns NBT instance if no tagName provided and root has value object', () => {
        let nestedData = {type: "compound", value: {key: {type: "int", value: 1}}}
        let nbt        = new NBT({value: nestedData})
        expect(nbt.get('')).toBeInstanceOf(NBT)
        expect(nbt.get('').root).toEqual(nestedData)
    })

    test('Returns null if no tagName provided and root lacks value property', () => {
        let nbt = new NBT({anotherField: {type: "int", value: 10}})
        expect(nbt.get('')).toBeNull()
    })
})

describe('NBT Class - Edge Cases', () => {
    test('Returns error when accessing nonexistent property', () => {
        let nbt = new NBT(data)
        expect(nbt.get('nonexistent')).toEqual(new Error('notValue'))
    })

    test('Returns null when accessing property in empty root', () => {
        let nbt = new NBT()
        expect(nbt.get('')).toBeNull()
    })

    test('Handles non-string tagName gracefully', () => {
        let nbt = new NBT(data)
        expect(nbt.get(null)).toBeNull()
        expect(nbt.get(undefined)).toBeNull()
        expect(nbt.get(123)).toBeNull()
    })

    test('Does not modify the original root object when retrieving nested NBT', () => {
        let nbt       = new NBT(data)
        let nestedNbt = nbt.get('').get('data')

        // Modify the nested object
        nestedNbt.root.obj = {type: "int", value: 99}

        // Original `nbt` object should remain unchanged
        expect(nbt.get('').get('data').get('obj')).toEqual(1)
    })

    test('Returns error for empty root initialized with empty object', () => {
        let nbt = new NBT({})
        expect(nbt.get('')).toBeNull()
        expect(nbt.get('nonexistent')).toEqual(new Error('notValue'))
    })
})