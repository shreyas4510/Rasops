export default function createSagaManager() {
    let sagas = {}
    let emitSagaAdditionListener = null

    return {

        addSaga: function (name, saga) {
            if (sagas[name]) {
                return
            }
            sagas = { ...sagas, [name]: saga }
            if (emitSagaAdditionListener) {
                emitSagaAdditionListener(saga)
            }
        },

        setAddSagaListener: function (listener) {
            emitSagaAdditionListener = listener
        }
    }
}