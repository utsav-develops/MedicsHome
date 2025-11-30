import * as Actions from '../actions/ActionTypes'

const initialState = {
    paypal_payment_status: 0,
    esewa_payment_status: 0
};

const PaymentReducer = (state = initialState, action) => {

    switch (action.type) {
        case Actions.PAYPAL_PAYMENT_STATUS:
            return Object.assign({}, state, {
                paypal_payment_status: action.data
            });

         case Actions.ESEWA_PAYMENT_STATUS:
            return Object.assign({}, state, {
                esewa_payment_status: action.data
            });
        default:
            return state;
    }
}

export default PaymentReducer;
