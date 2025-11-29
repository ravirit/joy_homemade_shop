// Simple Express backend stub for Joy Homemade Foods
// Provides endpoints to create payment intents (stub) and accept order webhooks.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

app.get('/health', (req, res) => res.json({status: 'ok'}));

// Stripe-style create payment intent (demo stub)
app.post('/create-payment-intent', (req, res) => {
  // In production: use stripe SDK server-side to create a PaymentIntent
  // Here we return a fake clientSecret for frontend demo.
  const { amount } = req.body;
  if(!amount) return res.status(400).json({error: 'Missing amount'});
  return res.json({clientSecret: 'pi_fake_client_secret_for_demo', amount});
});

// Razorpay-style order creation stub
app.post('/create-razorpay-order', (req, res) => {
  // In production: call Razorpay orders API
  const { amount } = req.body;
  if(!amount) return res.status(400).json({error: 'Missing amount'});
  return res.json({razorpay_order_id: 'order_fake_123', amount});
});

// Simple order webhook receiver (demo)
app.post('/webhook/order', (req, res) => {
  console.log('Webhook received:', req.body);
  res.json({received: true});
});

app.listen(PORT, ()=> console.log(`Backend stub running on port ${PORT}`));
