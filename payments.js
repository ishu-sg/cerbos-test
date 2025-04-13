// Payment processing module
const crypto = require('crypto');
const axios = require('axios');
const config = require('./config');

// SECURITY ISSUE: Hardcoded API keys
const STRIPE_API_KEY = 'sk_test_abcdefghijklmnopqrstuvwxyz';
const PAYPAL_CLIENT_ID = 'client-id-12345';
const PAYPAL_SECRET = 'client-secret-12345';

// SECURITY ISSUE: Handling sensitive payment data
async function processPayment(paymentDetails) {
  const { cardNumber, cvv, expiryDate, amount, currency } = paymentDetails;
  
  // SECURITY ISSUE: Logging sensitive data
  console.log(`Processing payment: ${amount} ${currency}, Card: ${cardNumber}`);
  
  // SECURITY ISSUE: No PCI compliance
  const paymentData = {
    card: {
      number: cardNumber,
      cvv,
      expiry: expiryDate
    },
    amount,
    currency
  };
  
  try {
    // Mock API call
    const response = await axios.post('https://api.payment-processor.com/charge', paymentData, {
      headers: {
        'Authorization': `Bearer ${STRIPE_API_KEY}`
      }
    });
    
    return {
      success: true,
      transactionId: response.data.id
    };
  } catch (error) {
    console.error('Payment error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// BUG: No input validation
function calculatePaymentFee(amount, method) {
  switch(method) {
    case 'credit_card':
      return amount * 0.029 + 0.30;
    case 'paypal':
      return amount * 0.039 + 0.30;
    case 'bank_transfer':
      return 0;
    default:
      // Missing error handling for invalid method
      return 0;
  }
}

// SECURITY ISSUE: Weak encryption
function encryptCardDetails(cardDetails) {
  const key = 'secretkey12345'; // Hard-coded key
  const cipher = crypto.createCipher('aes192', key);
  let encrypted = cipher.update(JSON.stringify(cardDetails), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// CODE SMELL: Function too complex
function generateInvoice(order, customer, paymentInfo) {
  // Complex function with 100+ lines
  const invoice = {
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      address: customer.address
    },
    items: order.items.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price
    })),
    subtotal: order.items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    tax: order.tax,
    total: order.total,
    payment: {
      method: paymentInfo.method,
      status: paymentInfo.status,
      transactionId: paymentInfo.transactionId
    }
  };
  
  // SECURITY ISSUE: Contains potentially sensitive information
  
  return invoice;
}

// DUPLICATION: Similar functionality to utils.formatDate
function formatInvoiceDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

module.exports = {
  processPayment,
  calculatePaymentFee,
  encryptCardDetails,
  generateInvoice,
  formatInvoiceDate
}; 