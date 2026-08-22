import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://tanishbatra397_db_user:ttMgLo2NixC5d3Fj@cluster0.npxsnrl.mongodb.net/dominos')
.then(async () => {
  const db = mongoose.connection.db;
  const orders = await db.collection('customer_orders').find().toArray();
  console.log('Customer Orders count:', orders.length);
  if(orders.length > 0) {
    console.log('Sample Order Status:', orders[0].status);
  }
  const kitchenOrders = await db.collection('orders').find().toArray();
  console.log('Kitchen Orders count:', kitchenOrders.length);
  if(kitchenOrders.length > 0) {
    console.log('Sample Kitchen Order Status:', kitchenOrders[0].status);
  }
  process.exit(0);
}).catch(console.error);
