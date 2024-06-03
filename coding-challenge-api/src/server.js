
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const zlib = require('zlib');

const app = express();
app.use(cors({origin: true, credentials: true}));


const loadOrders = () => {
    return new Promise((resolve, reject) => {
        const results = [];
        const filePath = path.join(__dirname, '..', 'data', 'orders.csv.gz');
        console.log(`Loading orders from: ${filePath}`);

        const stream = fs.createReadStream(filePath)
            .on('error', (err) => {
                console.error(`Error reading file: ${filePath}`, err);
                reject(err);
            });

        stream
            .pipe(zlib.createGunzip())
            .on('error', (err) => {
                console.error('Error decompressing file:', err);
                reject(err);
            })
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                console.log(`Loaded ${results.length} orders`);
                resolve(results);
            })
            .on('error', (err) => {
                console.error('Error parsing CSV:', err);
                reject(err);
            });
    });
};

const loadStores = () => {
    return new Promise((resolve, reject) => {
        const results = [];
        const filePath = path.join(__dirname, '..', 'data', 'stores.csv');
        console.log(`Loading stores from: ${filePath}`);

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error(`stores.csv not found at: ${filePath}`);
                reject(`stores.csv not found at: ${filePath}`);
                return;
            }

            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    console.log(`Loaded ${results.length} stores`);
                    resolve(results);
                })
                .on('error', (err) => {
                    console.error(`Error loading stores: ${err}`);
                    reject(err);
                });
        });
    });
};


app.get('/api/orders', async (req, res) => {
    try {
        const orders = await loadOrders();
        console.log('Loaded orders:', orders);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Error fetching orders');
    }
});

app.get('/api/stores', async (req, res) => {
    try {
        const stores = await loadStores();
        console.log('Loaded stores:', stores);
        res.json(stores);
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).send('Error fetching stores');
    }
});

app.get('/api/merged-orders', async (req, res) => {
    try {
        const orders = await loadOrders();
        const stores = await loadStores();

        const mergedData = orders.map(order => {
            const store = stores.find(store => store.storeId === order.storeId);
            const currentDate = new Date();
            const latestShipDate = new Date(order.latest_ship_date);
            const daysOverdue = Math.abs(Math.floor((currentDate - latestShipDate) / (1000 * 60 * 60 * 24)));
            const overdueDays = daysOverdue > 0 ? daysOverdue : 0;
            return {
                orderId: order.orderId,
                marketplace: store ? store.marketplace : '',
                storeName: store ? store.shopName : '',
                orderValue: order.orderValue,
                items: order.items,
                destination: order.destination,
                daysOverdue: overdueDays,
            };
        });

        res.json(mergedData);
    } catch (error) {
        console.error('Error fetching merged data:', error);
        res.status(500).send('Error fetching merged data');
    }
});



const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.timeout = 0; // Disable timeout
module.exports = app;
