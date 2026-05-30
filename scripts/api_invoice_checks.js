require('dotenv').config({ path: '.env' });
const axios = require('axios');

const PORT = process.env.PORT || 5000;
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;

async function run() {
  try {
    console.log('Base URL:', baseUrl);

    // Create invoice
    const createPayload = {
      customer: 'API Test Customer',
      items: [
        { desc: 'Service A', qty: 1, price: 100 },
        { desc: 'Service B', qty: 2, price: 50 },
      ],
      total: 200,
    };

    const createRes = await axios.post(`${baseUrl}/api/v1/invoices`, createPayload, { timeout: 10000 });
    console.log('Create status', createRes.status);
    const invoice = createRes.data;
    const id = invoice._id || invoice.id;
    console.log('Created invoice id:', id);

    // Get invoice
    const getRes = await axios.get(`${baseUrl}/api/v1/invoices/${id}`, { timeout: 10000 });
    console.log('Get status', getRes.status, 'customer:', getRes.data.customer || getRes.data.customer);

    // Update invoice
    const updatePayload = { customer: 'API Test Customer Updated', total: 250 };
    const updateRes = await axios.put(`${baseUrl}/api/v1/invoices/${id}`, updatePayload, { timeout: 10000 });
    console.log('Update status', updateRes.status, 'new customer:', updateRes.data.customer);

    // Delete invoice
    const deleteRes = await axios.delete(`${baseUrl}/api/v1/invoices/${id}`, { timeout: 10000 });
    console.log('Delete status', deleteRes.status, deleteRes.data.message || 'deleted');

    // Verify deletion
    try {
      await axios.get(`${baseUrl}/api/v1/invoices/${id}`, { timeout: 10000 });
      console.log('Verification: invoice still exists (unexpected)');
    } catch (err) {
      if (err.response) {
        console.log('Verification get returned', err.response.status);
      } else {
        console.log('Verification get error:', err.message);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('Script error:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
}

run();
