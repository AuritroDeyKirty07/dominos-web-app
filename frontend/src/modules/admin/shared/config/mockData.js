// src/shared/config/mockData.js
// Comprehensive mock data for local development

const NOW = new Date();

function daysAgo(n) {
  const d = new Date(NOW);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function hoursAgo(n) {
  const d = new Date(NOW);
  d.setHours(d.getHours() - n);
  return d.toISOString();
}

function minutesAgo(n) {
  const d = new Date(NOW);
  d.setMinutes(d.getMinutes() - n);
  return d.toISOString();
}

export const mockOrders = [
  { id: 'ORD-1001', customerName: 'Rahul Sharma', phone: '9876543210', items: ['Margherita Pizza', 'Garlic Bread'], total: 599, paymentStatus: 'Paid', deliveryStatus: 'Delivered', createdAt: hoursAgo(2) },
  { id: 'ORD-1002', customerName: 'Priya Patel', phone: '9876543211', items: ['Farmhouse Pizza', 'Coke'], total: 749, paymentStatus: 'Paid', deliveryStatus: 'Out for Delivery', createdAt: minutesAgo(45) },
  { id: 'ORD-1003', customerName: 'Amit Kumar', phone: '9876543212', items: ['Peppy Paneer', 'Stuffed Garlic Bread', 'Lava Cake'], total: 1120, paymentStatus: 'Paid', deliveryStatus: 'Cooking', createdAt: minutesAgo(20) },
  { id: 'ORD-1004', customerName: 'Sneha Gupta', phone: '9876543213', items: ['Cheese Burst Pizza'], total: 499, paymentStatus: 'Pending', deliveryStatus: 'Order Received', createdAt: minutesAgo(5) },
  { id: 'ORD-1005', customerName: 'Vikram Singh', phone: '9876543214', items: ['Non-Veg Supreme', 'Wings', 'Pepsi'], total: 1350, paymentStatus: 'Paid', deliveryStatus: 'Delivered', createdAt: hoursAgo(5) },
  { id: 'ORD-1006', customerName: 'Meera Joshi', phone: '9876543215', items: ['Veggie Paradise'], total: 399, paymentStatus: 'Refunded', deliveryStatus: 'Cancelled', createdAt: daysAgo(1) },
  { id: 'ORD-1007', customerName: 'Arjun Reddy', phone: '9876543216', items: ['Mexican Green Wave', 'Taco Mexicana'], total: 879, paymentStatus: 'Paid', deliveryStatus: 'Delivered', createdAt: daysAgo(1) },
  { id: 'ORD-1008', customerName: 'Kavya Nair', phone: '9876543217', items: ['Margherita Pizza', 'Pasta Italiano'], total: 699, paymentStatus: 'Paid', deliveryStatus: 'Preparing', createdAt: minutesAgo(10) },
  { id: 'ORD-1009', customerName: 'Rohit Verma', phone: '9876543218', items: ['Chicken Dominator', 'Stuffed Garlic Bread'], total: 1499, paymentStatus: 'Paid', deliveryStatus: 'Delivered', createdAt: daysAgo(2) },
  { id: 'ORD-1010', customerName: 'Anita Desai', phone: '9876543219', items: ['Peppy Paneer', 'Brownie'], total: 649, paymentStatus: 'Paid', deliveryStatus: 'Delivered', createdAt: daysAgo(3) },
  { id: 'ORD-1011', customerName: 'Deepak Chauhan', phone: '9876543220', items: ['Farmhouse Pizza', 'Garlic Bread', 'Coke'], total: 899, paymentStatus: 'Paid', deliveryStatus: 'Delivered', createdAt: daysAgo(4) },
  { id: 'ORD-1012', customerName: 'Simran Kaur', phone: '9876543221', items: ['Cheese Burst Pizza', 'Lava Cake'], total: 749, paymentStatus: 'Paid', deliveryStatus: 'Delivered', createdAt: daysAgo(5) },
  { id: 'ORD-1013', customerName: 'Raj Malhotra', phone: '9876543222', items: ['Non-Veg Supreme'], total: 899, paymentStatus: 'Paid', deliveryStatus: 'Delivered', createdAt: daysAgo(6) },
  { id: 'ORD-1014', customerName: 'Pooja Mehta', phone: '9876543223', items: ['Margherita Pizza', 'Pasta Italiano', 'Pepsi'], total: 950, paymentStatus: 'Paid', deliveryStatus: 'Delivered', createdAt: daysAgo(7) },
  { id: 'ORD-1015', customerName: 'Karan Kapoor', phone: '9876543224', items: ['Mexican Green Wave', 'Wings'], total: 1050, paymentStatus: 'Pending', deliveryStatus: 'Order Received', createdAt: minutesAgo(2) },
];

export const mockUsers = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@test.com', phone: '9876543210', address: 'Flat 402, Sunshine Apts, MG Road', city: 'Mumbai', role: 'VIP Customer', ordersCount: 12, totalSpent: 8500, joinedAt: daysAgo(90), isActive: true },
  { id: 2, name: 'Priya Patel', email: 'priya@test.com', phone: '9876543211', address: 'Plot 18, Sector 14, Gandhinagar', city: 'Ahmedabad', role: 'Customer', ordersCount: 8, totalSpent: 5200, joinedAt: daysAgo(60), isActive: true },
  { id: 3, name: 'Amit Kumar', email: 'amit@test.com', phone: '9876543212', address: 'H-301, Green Glen Layout, Bellandur', city: 'Bengaluru', role: 'VIP Customer', ordersCount: 15, totalSpent: 12000, joinedAt: daysAgo(180), isActive: true },
  { id: 4, name: 'Sneha Gupta', email: 'sneha@test.com', phone: '9876543213', address: 'B-12, Lajpat Nagar III', city: 'New Delhi', role: 'Customer', ordersCount: 3, totalSpent: 1500, joinedAt: daysAgo(10), isActive: true },
  { id: 5, name: 'Vikram Singh', email: 'vikram@test.com', phone: '9876543214', address: 'Villa 5, Palm Meadows, Whitefield', city: 'Bengaluru', role: 'VIP Customer', ordersCount: 20, totalSpent: 18000, joinedAt: daysAgo(365), isActive: true },
  { id: 6, name: 'Meera Joshi', email: 'meera@test.com', phone: '9876543215', address: 'Flat 12B, Sea Green Heights, Bandra', city: 'Mumbai', role: 'Customer', ordersCount: 5, totalSpent: 3200, joinedAt: daysAgo(45), isActive: false },
  { id: 7, name: 'Arjun Reddy', email: 'arjun@test.com', phone: '9876543216', address: 'Road No. 36, Jubilee Hills', city: 'Hyderabad', role: 'Customer', ordersCount: 9, totalSpent: 7800, joinedAt: daysAgo(120), isActive: true },
  { id: 8, name: 'Kavya Nair', email: 'kavya@test.com', phone: '9876543217', address: '24/1140, Panampilly Nagar', city: 'Kochi', role: 'Customer', ordersCount: 6, totalSpent: 4100, joinedAt: daysAgo(30), isActive: true },
  { id: 9, name: 'Rohit Verma', email: 'rohit@test.com', phone: '9876543218', address: 'Sector 62, Golf Course Road', city: 'Gurugram', role: 'Customer', ordersCount: 11, totalSpent: 9600, joinedAt: daysAgo(200), isActive: true },
  { id: 10, name: 'Anita Desai', email: 'anita@test.com', phone: '9876543219', address: 'Civil Lines, Raj Bhavan Road', city: 'Jaipur', role: 'Customer', ordersCount: 2, totalSpent: 1300, joinedAt: daysAgo(5), isActive: true },
];

export const mockEmployees = [
  // Cooks
  { id: 1, name: 'Suresh Yadav', role: 'Cook', status: 'Active', phone: '9811122201', email: 'suresh.cook@dominos.com', specialty: 'Pizza Master (Cheese Burst)', shift: 'Morning', rating: 4.9, joinedAt: daysAgo(300), ordersHandled: 450 },
  { id: 2, name: 'Prakash Thakur', role: 'Cook', status: 'Active', phone: '9811122202', email: 'prakash.cook@dominos.com', specialty: 'Oven & Baking Specialist', shift: 'Evening', rating: 4.8, joinedAt: daysAgo(150), ordersHandled: 320 },
  { id: 3, name: 'Aakash Verma', role: 'Cook', status: 'Active', phone: '9811122203', email: 'aakash.cook@dominos.com', specialty: 'Appetizers & Pasta Chef', shift: 'Night', rating: 4.7, joinedAt: daysAgo(90), ordersHandled: 280 },
  { id: 4, name: 'Neha Soni', role: 'Cook', status: 'On Break', phone: '9811122204', email: 'neha.cook@dominos.com', specialty: 'Dough Prep & Quality Check', shift: 'Morning', rating: 4.9, joinedAt: daysAgo(80), ordersHandled: 200 },

  // Delivery Drivers
  { id: 5, name: 'Ramesh Gupta', role: 'Delivery Driver', status: 'Active', phone: '9822233301', email: 'ramesh.delivery@dominos.com', vehicleType: 'Bike', vehicleNumber: 'MH-02-AB-1234', rating: 4.95, joinedAt: daysAgo(200), ordersHandled: 820 },
  { id: 6, name: 'Sunil Chawla', role: 'Delivery Driver', status: 'On Delivery', phone: '9822233302', email: 'sunil.delivery@dominos.com', vehicleType: 'EV Scooter', vehicleNumber: 'DL-01-EV-5678', rating: 4.85, joinedAt: daysAgo(180), ordersHandled: 640 },
  { id: 7, name: 'Mohan Lal', role: 'Delivery Driver', status: 'Inactive', phone: '9822233303', email: 'mohan.delivery@dominos.com', vehicleType: 'Scooter', vehicleNumber: 'KA-05-CD-9012', rating: 4.6, joinedAt: daysAgo(400), ordersHandled: 500 },
  { id: 8, name: 'Deepak Rao', role: 'Delivery Driver', status: 'Active', phone: '9822233304', email: 'deepak.delivery@dominos.com', vehicleType: 'Bike', vehicleNumber: 'TS-09-EF-3456', rating: 4.9, joinedAt: daysAgo(110), ordersHandled: 390 },

  // Management & Other
  { id: 9, name: 'Lakshmi Iyer', role: 'Manager', status: 'Active', phone: '9833344401', email: 'lakshmi.manager@dominos.com', shift: 'Morning', rating: 5.0, joinedAt: daysAgo(500), ordersHandled: 0 },
  { id: 10, name: 'Sunita Devi', role: 'Cashier', status: 'Active', phone: '9833344402', email: 'sunita.cashier@dominos.com', shift: 'Evening', rating: 4.8, joinedAt: daysAgo(100), ordersHandled: 600 },
];

export const mockSalesData = {
  today: [
    { time: '8 AM', sales: 1200 },
    { time: '9 AM', sales: 1800 },
    { time: '10 AM', sales: 2400 },
    { time: '11 AM', sales: 3200 },
    { time: '12 PM', sales: 5500 },
    { time: '1 PM', sales: 6200 },
    { time: '2 PM', sales: 4800 },
    { time: '3 PM', sales: 3500 },
    { time: '4 PM', sales: 3000 },
    { time: '5 PM', sales: 2800 },
    { time: '6 PM', sales: 4200 },
    { time: '7 PM', sales: 6800 },
    { time: '8 PM', sales: 7500 },
    { time: '9 PM', sales: 5600 },
  ],
  weekly: [
    { time: 'Mon', sales: 32000 },
    { time: 'Tue', sales: 28000 },
    { time: 'Wed', sales: 35000 },
    { time: 'Thu', sales: 31000 },
    { time: 'Fri', sales: 45000 },
    { time: 'Sat', sales: 52000 },
    { time: 'Sun', sales: 48000 },
  ],
  monthly: [
    { time: 'Week 1', sales: 180000 },
    { time: 'Week 2', sales: 210000 },
    { time: 'Week 3', sales: 195000 },
    { time: 'Week 4', sales: 240000 },
  ],
  yearly: [
    { time: 'Jan', sales: 650000 },
    { time: 'Feb', sales: 580000 },
    { time: 'Mar', sales: 720000 },
    { time: 'Apr', sales: 690000 },
    { time: 'May', sales: 810000 },
    { time: 'Jun', sales: 750000 },
    { time: 'Jul', sales: 880000 },
    { time: 'Aug', sales: 920000 },
    { time: 'Sep', sales: 780000 },
    { time: 'Oct', sales: 850000 },
    { time: 'Nov', sales: 900000 },
    { time: 'Dec', sales: 1050000 },
  ],
};

export const mockRevenueData = {
  today: [
    { time: '8 AM', revenue: 1200, profit: 400, orders: 3 },
    { time: '10 AM', revenue: 3600, profit: 1200, orders: 8 },
    { time: '12 PM', revenue: 5500, profit: 1800, orders: 12 },
    { time: '2 PM', revenue: 4800, profit: 1500, orders: 10 },
    { time: '4 PM', revenue: 3000, profit: 900, orders: 7 },
    { time: '6 PM', revenue: 6200, profit: 2100, orders: 14 },
    { time: '8 PM', revenue: 7500, profit: 2500, orders: 16 },
  ],
  weekly: [
    { time: 'Mon', revenue: 32000, profit: 10500, orders: 65 },
    { time: 'Tue', revenue: 28000, profit: 9200, orders: 58 },
    { time: 'Wed', revenue: 35000, profit: 11500, orders: 72 },
    { time: 'Thu', revenue: 31000, profit: 10000, orders: 63 },
    { time: 'Fri', revenue: 45000, profit: 15000, orders: 92 },
    { time: 'Sat', revenue: 52000, profit: 17500, orders: 108 },
    { time: 'Sun', revenue: 48000, profit: 16000, orders: 98 },
  ],
  monthly: [
    { time: 'Week 1', revenue: 180000, profit: 60000, orders: 380 },
    { time: 'Week 2', revenue: 210000, profit: 70000, orders: 440 },
    { time: 'Week 3', revenue: 195000, profit: 65000, orders: 410 },
    { time: 'Week 4', revenue: 240000, profit: 80000, orders: 500 },
  ],
};

export const mockActivities = [
  { id: 1, type: 'order', message: 'New order #ORD-1015 placed by Karan Kapoor', time: minutesAgo(2) },
  { id: 2, type: 'order', message: 'New order #ORD-1004 placed by Sneha Gupta', time: minutesAgo(5) },
  { id: 3, type: 'delivery', message: 'Order #ORD-1001 delivered by Ramesh Gupta', time: hoursAgo(2) },
  { id: 4, type: 'employee', message: 'Chef Suresh prepared special Cheese Burst order #ORD-1003', time: minutesAgo(20) },
  { id: 5, type: 'refund', message: 'Refund processed for order #ORD-1006', time: daysAgo(1) },
  { id: 6, type: 'customer', message: 'New customer Anita Desai registered', time: daysAgo(5) },
  { id: 7, type: 'delivery', message: 'Order #ORD-1005 delivered successfully by Sunil Chawla', time: hoursAgo(5) },
  { id: 8, type: 'order', message: 'New order #ORD-1008 placed by Kavya Nair', time: minutesAgo(10) },
];

export const mockNotifications = [
  { id: 1, type: 'new_order', title: 'New Order', message: 'Order #ORD-1015 received from Karan Kapoor', time: minutesAgo(2), read: false },
  { id: 2, type: 'delayed', title: 'Order Delayed', message: 'Order #ORD-1003 is taking longer in oven', time: minutesAgo(15), read: false },
  { id: 3, type: 'employee', title: 'Delivery Fleet', message: 'Sunil Chawla marked On Delivery for ORD-1002', time: minutesAgo(40), read: false },
  { id: 4, type: 'inventory', title: 'Low Inventory', message: 'Mozzarella cheese stock is running low', time: hoursAgo(3), read: true },
  { id: 5, type: 'new_order', title: 'New Order', message: 'Order #ORD-1004 received from Sneha Gupta', time: minutesAgo(5), read: true },
];

// ─── Mock Menu Items ───────────────────────────────────────────────────────────
// Used as local fallback when the backend is not available (VITE_USE_MOCK=true)
// or when the backend is unreachable during development.
// The real source of truth is the MongoDB MenuItem collection.
export const mockMenuItems = [
  {
    id: 'mock-1',
    name: 'Margherita',
    description: 'Classic loaded with rich tomato sauce and mozzarella cheese',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80',
    sizes: { S: 199, M: 349, L: 499 },
    isAvailable: true,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(30),
  },
  {
    id: 'mock-2',
    name: 'Farmhouse',
    description: 'Loaded with fresh garden vegetables — capsicum, mushroom, onion & tomato',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
    sizes: { S: 249, M: 399, L: 549 },
    isAvailable: true,
    createdAt: daysAgo(25),
    updatedAt: daysAgo(25),
  },
  {
    id: 'mock-3',
    name: 'Peppy Paneer',
    description: 'Chunky paneer with capsicum and tangy tomato sauce',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&q=80',
    sizes: { S: 269, M: 429, L: 569 },
    isAvailable: true,
    createdAt: daysAgo(20),
    updatedAt: daysAgo(20),
  },
  {
    id: 'mock-4',
    name: 'Cheese Burst',
    description: 'Every bite has a burst of liquid cheese hidden inside the crust',
    image: 'https://images.unsplash.com/photo-1600628421055-4d30de868b8f?w=400&q=80',
    sizes: { S: 299, M: 479, L: 649 },
    isAvailable: true,
    createdAt: daysAgo(15),
    updatedAt: daysAgo(15),
  },
  {
    id: 'mock-5',
    name: 'Mexican Green Wave',
    description: 'Jalapeños, onions, capsicum & a fiery Mexican seasoning',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
    sizes: { S: 229, M: 379, L: 519 },
    isAvailable: false,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(2),
  },
];
