// server.test.js

const request = require('supertest');
const app = require('../src/server');

describe('API Endpoints', () => {
  it('GET /api/orders should return 200 with orders data', async () => {
    const response = await request(app).get('/api/orders');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  },20000);

  it('GET /api/stores should return 200 with stores data', async () => {
    const response = await request(app).get('/api/stores');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  },60000);


it('GET /api/merged-orders should return 200 with merged data', async () => {
    const response = await request(app).get('/api/merged-orders');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  }, 20000); 


it('GET /api/orders should return 200 with orders data', async () => {
    const response = await request(app).get('/api/orders');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length >= 5) {
      const orders = response.body.slice(0, 5); 
      orders.forEach(order => {
        expect(order).toHaveProperty('orderId');
        expect(order).toHaveProperty('storeId');
        expect(order).toHaveProperty('orderValue');
        expect(order).toHaveProperty('items');
        expect(order).toHaveProperty('destination');
        expect(order).toHaveProperty('latest_ship_date');
      });
    }
  }, 20000); 

  it('GET /api/stores should return correct store data structure', async () => {
    const response = await request(app).get('/api/stores');
    const stores = response.body;
    stores.forEach(store => {
      expect(store).toHaveProperty('storeId');
      expect(store).toHaveProperty('marketplace');
      expect(store).toHaveProperty('shopName');
    });
  }, 20000);

  it('GET /api/merged-orders should merge data correctly', async () => {
    const response = await request(app).get('/api/merged-orders');
    const mergedOrders = response.body.slice(0, 5);
    mergedOrders.forEach(order => {
      expect(order).toHaveProperty('orderId');
      expect(order).toHaveProperty('marketplace');
      expect(order).toHaveProperty('storeName');
      expect(order).toHaveProperty('orderValue');
      expect(order).toHaveProperty('items');
      expect(order).toHaveProperty('destination');
      expect(order).toHaveProperty('daysOverdue');
    });
  }, 20000);

});