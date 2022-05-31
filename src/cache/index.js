export default class FormulaikCache {
    _data = {}
    constructor(props) {

    }

    get data() { return this._data }
    set data(value) { this._data = value }

    add = ({ search, results, key }) => {
        const _key = key.toLowerCase()
        if (!this.data[_key]) {
            this.data[_key] = {}
        }
        this.data[_key][search] = [...results]
        //console.log('Formulaik cache > add >', _key, search, results)
    }

    get = ({ search, key }) => {
        const _key = key.toLowerCase()
        if (!this.data[_key]) {
            //console.log('Formulaik cache > get > key is not present', _key)
            return null
        }

        //console.log('Formulaik cache > get > key is present', _key, 'Returning', this.data[_key][search])
        return this.data[_key][search]
    }

    clear = () => {
        this.data = {}
    }
}
