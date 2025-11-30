import * as ActionTypes from './ActionTypes';

export const paypalPaymentStatus = (data) => ({
    type: ActionTypes.PAYPAL_PAYMENT_STATUS,
    data: data
})

export const esewaPaymentStatus = (data) => ({
  type: ActionTypes.ESEWA_PAYMENT_STATUS,
  data: data
});