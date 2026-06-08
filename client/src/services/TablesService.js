import Api from './Api'
export default {
    index() {
        return Api().get('tables')
    },
    show(tableId) {
        return Api().get('table/' + tableId)
    },
    post(table) {
        return Api().post('table', table)
    },
    put(table) {
        return Api().put('table/' + table.id, table)
    },
    delete(table) {
        return Api().delete('table/' + table.id)
    }
}