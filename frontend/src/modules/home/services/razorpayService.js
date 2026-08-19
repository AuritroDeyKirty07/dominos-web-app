/**
 * razorpayService.js
 * Frontend-only Razorpay integration helper.
 *
 * NOTE: This uses the Razorpay JS SDK loaded via <script> in index.html.
 */

export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_Rk2f1YGduwiC3R';

export const isRazorpayLoaded = () => typeof window.Razorpay === 'function';

export const initiateRazorpayPayment = ({
  amountInPaise,
  customerName = 'Customer',
  customerEmail = '',
  customerPhone = '9999999999',
  description = "Pizza Shop Transaction",
  internalOrderId = '',
}) => {
  return new Promise((resolve, reject) => {
    if (!isRazorpayLoaded()) {
      reject(new Error(
        'Razorpay SDK is not available. Please check your internet connection and refresh the page.'
      ));
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: String(amountInPaise),
      currency: 'INR',
      name: "Domino's Pizza",
      description,
      image: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg',
      handler: function (response) {
        resolve(response);
      },
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone,
      },
      notes: {
        internal_order_id: internalOrderId,
      },
      theme: {
        color: '#006491',
      },
      modal: {
        ondismiss: function () {
          reject(new Error('Payment was cancelled.'));
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      reject({
        code: response.error.code,
        description: response.error.description,
        source: response.error.source,
        step: response.error.step,
        reason: response.error.reason,
        metadata: response.error.metadata,
      });
    });

    rzp.open();
  });
};

