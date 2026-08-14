export default class FormulaikCache {
    _data = {}
    _cdata = {}
    _order = []
    _maxEntries = 200

    constructor(props) {

    }

    get data() { return this._data }
    set data(value) { this._data = value }

    get cdata() { return this._cdata }
    set cdata(value) { this._cdata = value }


    add = ({ search, results, key }) => {
        const _key = key.toLowerCase()
        const _search = (search || '').toLowerCase()
        if (!this.data[_key]) {
            this.data[_key] = {}
        }

        if (!this.data[_key][_search]) {
            this._order.push(`${_key}::${_search}`)
            if (this._order.length > this._maxEntries) {
                const [oldKey, oldSearch] = this._order.shift().split('::')
                if (this.data[oldKey]) {
                    delete this.data[oldKey][oldSearch]
                }
            }
        }

        this.data[_key][_search] = [...results]
    }

    get = ({ search, key }) => {
        const _key = key.toLowerCase()
        const _search = (search || '').toLowerCase()
        if (!this.data[_key]) {
            return null
        }

        return this.data[_key][_search]
    }

    clear = () => {
        this.data = {}
        this._order = []
    }


    addComponent = ({ component, key }) => {
        const _key = key.toLowerCase()
        this.cdata[_key] = component
    }

    getComponent = ({ key }) => {
        const _key = key.toLowerCase()
        if (!this.cdata[_key]) {
            return null
        }

        return this.cdata[_key]
    }
}
