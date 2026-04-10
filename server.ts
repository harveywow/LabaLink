import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Mock Database
const users = [
  { id: 1, name: 'Customer One', email: 'customer@test.com', role: 'customer', points: 150, phone: '+63 912 345 6789', address: '123 Manila Street, Metro Manila' },
  { id: 2, name: 'Admin User', email: 'admin@test.com', role: 'admin', points: 0, phone: '', address: '' },
  { id: 3, name: 'Staff Member', email: 'staff@test.com', role: 'staff', points: 0, phone: '', address: '' },
];

let orders = [
  { id: 101, customerId: 1, service: 'Wash & Fold', status: 'Received', weight: 5, total: 250, date: new Date().toISOString() },
  { id: 102, customerId: 1, service: 'Dry Cleaning', status: 'Washing', weight: 2, total: 400, date: new Date().toISOString() },
];

let settings = {
  storeName: 'LabaLink Laundry',
  contactEmail: 'admin@labalink.com',
  contactPhone: '+63 912 345 6789',
  address: '123 Laundry St, Manila, Philippines',
  currency: 'PHP',
  taxRate: 12
};

// API Routes
app.post('/api/login', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    // In a real app, verify password and sign JWT
    res.json({ token: 'mock-jwt-token', user });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    ...req.body,
    role: 'customer',
    points: 0
  };
  users.push(newUser);
  res.json(newUser);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex(u => u.id === Number(id));
  if (userIndex > -1) {
    users[userIndex] = { ...users[userIndex], ...req.body };
    res.json(users[userIndex]);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/api/users/:id/redeem', (req, res) => {
  const { id } = req.params;
  const { pointsToDeduct } = req.body;
  const userIndex = users.findIndex(u => u.id === Number(id));
  
  if (userIndex > -1) {
    if (users[userIndex].points >= pointsToDeduct) {
      users[userIndex].points -= pointsToDeduct;
      res.json(users[userIndex]);
    } else {
      res.status(400).json({ error: 'Insufficient points' });
    }
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/api/settings', (req, res) => {
  res.json(settings);
});

app.put('/api/settings', (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

app.get('/api/orders', (req, res) => {
  const { role, userId } = req.query;
  
  const populatedOrders = orders.map(order => {
    const customer = users.find(u => u.id === order.customerId);
    return {
      ...order,
      customerName: customer?.name || 'Unknown',
      customerPhone: customer?.phone || 'N/A',
      customerAddress: customer?.address || 'N/A'
    };
  });

  if (role === 'customer') {
    res.json(populatedOrders.filter(o => o.customerId === Number(userId)));
  } else {
    res.json(populatedOrders);
  }
});

app.post('/api/orders', (req, res) => {
  const newOrder = {
    id: 100 + orders.length + 1,
    ...req.body,
    status: 'Received',
    date: new Date().toISOString()
  };
  orders.push(newOrder);
  res.json(newOrder);
});

app.put('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const orderIndex = orders.findIndex(o => o.id === Number(id));
  if (orderIndex > -1) {
    const previousStatus = orders[orderIndex].status;
    orders[orderIndex].status = status;
    const order = orders[orderIndex];
    
    // Add points if order is completed (10 points per 100 PHP)
    if (status === 'Completed' && previousStatus !== 'Completed') {
      const customerIndex = users.findIndex(u => u.id === order.customerId);
      if (customerIndex > -1) {
        const pointsEarned = Math.floor(order.total / 100) * 10;
        users[customerIndex].points += pointsEarned;
      }
    }

    const customer = users.find(u => u.id === order.customerId);
    const populatedOrder = {
      ...order,
      customerName: customer?.name || 'Unknown',
      customerPhone: customer?.phone || 'N/A',
      customerAddress: customer?.address || 'N/A'
    };
    res.json(populatedOrder);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

app.get('/api/analytics', (req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  res.json({ totalRevenue, totalOrders });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
