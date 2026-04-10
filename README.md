# LabaLink Smart Laundry

## Architecture Diagram

```text
+-------------------+       +-------------------+       +-------------------+
|   Frontend (SPA)  |       |   Backend (API)   |       |     Database      |
|                   |       |                   |       |                   |
| - React           |<----->| - Node.js         |<----->| - PostgreSQL      |
| - Vite            | REST  | - Express         | SQL   |                   |
| - Tailwind CSS    |       | - JWT Auth        |       |                   |
| - React Router    |       |                   |       |                   |
+-------------------+       +-------------------+       +-------------------+
        |                           |                           |
        v                           v                           v
+-------------------+       +-------------------+       +-------------------+
|   External APIs   |       |   Payment Gateway |       |   Cloud Storage   |
| - SMS/Email       |<----->| - PayMongo /      |       | - AWS S3 / GCS    |
|   Notifications   |       |   Stripe          |       |   (Images)        |
+-------------------+       +-------------------+       +-------------------+
```

## Database Schema (PostgreSQL)

```sql
-- Users Table (Customers, Staff, Admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services Table (Wash & Fold, Dry Cleaning, etc.)
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_kg DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id),
    service_id INTEGER REFERENCES services(id),
    weight DECIMAL(5, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Received' CHECK (status IN ('Received', 'Washing', 'Drying', 'Ready', 'Out for Delivery', 'Completed')),
    payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'gcash', 'card')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    pickup_address TEXT,
    delivery_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table (For digital payments)
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_gateway VARCHAR(50),
    gateway_reference VARCHAR(255),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loyalty Points History
CREATE TABLE loyalty_points (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    order_id INTEGER REFERENCES orders(id),
    points_earned INTEGER DEFAULT 0,
    points_redeemed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Delivery Details
CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    staff_id INTEGER REFERENCES users(id), -- Assigned driver
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_transit', 'delivered', 'failed')),
    scheduled_time TIMESTAMP,
    delivered_time TIMESTAMP,
    notes TEXT
);
```

## Folder Structure

```text
/
├── server.ts                 # Express backend entry point
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Router configuration
│   ├── index.css             # Tailwind CSS
│   ├── lib/
│   │   └── utils.ts          # Utility functions (cn)
│   ├── components/           # Reusable UI components
│   └── pages/                # Route components
│       ├── Home.tsx          # Landing page
│       ├── Login.tsx         # Authentication
│       ├── customer/         # Customer portal
│       │   ├── Dashboard.tsx
│       │   └── Book.tsx
│       ├── admin/            # Admin dashboard
│       │   └── Dashboard.tsx
│       └── staff/            # Staff portal
│           └── Dashboard.tsx
```

## State Management Approach
For this application, we are using **React Local State (`useState`)** and **Context API** (or simple prop drilling) for UI state, combined with **React Router** for navigation state. For a production app, we recommend using **React Query (TanStack Query)** for server state management (caching, deduplication, background updates) and **Zustand** for complex global client state if needed.

## Future Scalability Suggestions
1. **Microservices Architecture**: As the app grows, split the monolithic Node.js backend into microservices (e.g., User Service, Order Service, Payment Service).
2. **Read Replicas**: Use PostgreSQL read replicas to handle high traffic on the admin dashboard analytics without affecting the main transactional database.
3. **Caching**: Implement Redis for caching frequently accessed data like service pricing and active orders.
4. **Message Queues**: Use RabbitMQ or AWS SQS for handling asynchronous tasks like sending SMS/Email notifications and processing payments.

## Mobile App Expansion Plan
1. **React Native / Expo**: Since the frontend is built with React, transitioning to a mobile app using React Native is the most efficient path.
2. **PWA (Progressive Web App)**: In the short term, configure the Vite app as a PWA so users can install it on their home screens.
3. **Push Notifications**: Integrate Firebase Cloud Messaging (FCM) for real-time order updates on mobile devices.

## AI Features (Bonus)
1. **Demand Prediction**: Use machine learning models (e.g., Prophet or XGBoost) to predict peak laundry days based on historical data and weather forecasts, allowing for better staff scheduling.
2. **Smart Scheduling**: Implement an AI-driven routing algorithm (like Google OR-Tools) to optimize pickup and delivery routes for drivers, reducing fuel costs and delivery times.
3. **Automated Quality Control**: Use computer vision (e.g., TensorFlow.js) to detect stains or fabric types from photos uploaded by customers to automatically suggest the best cleaning method.
