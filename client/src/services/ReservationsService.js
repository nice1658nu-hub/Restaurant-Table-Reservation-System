import Api from './Api'

export default {
    index() {
        return Api().get('reservations')
    },
    post(reservation) {
        return Api().post('reservation', reservation)
    },
    put(reservation) {
        return Api().put('reservation/' + reservation.id, reservation)
    },
    delete(reservationId) {
        return Api().delete('reservation/' + reservationId)
    }
}