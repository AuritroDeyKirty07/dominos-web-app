# TEAM 2 ORDER SCHEMA & REUSE ANALYSIS REPORT

This report provides a field-by-field schema analysis between the Team 3 (Kitchen) and Team 2 (Customer) order schemas. It highlights potential compilation and data-integrity conflicts, and recommends a clean integration architecture that preserves all existing systems without modifying other teams' source code.

---

## 1. Schema Fields Comparison

### Kitchen Order Schema (`backend/src/modules/kitchen/models/Order.js`)
- `orderNumber` (String, required, unique)
- `customerName` (String, required)
- `items`: Array of objects containing:
  - `name` (String, required)
  - `quantity` (Number, required)
- `status` (String, enum: `['Placed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered']`, default: `'Placed'`)
- `createdAt` & `updatedAt` (Automated timestamps)

### Customer Order Schema (`dominos-final/backend/models/Order.js`)
- `orderId` (String, required, unique)
- `customerId` (String, required)
- `items`: Array of objects containing:
  - `id` (String, required)
  - `name` (String, required)
  - `category` (String)
  - `isVeg` (Boolean, default: true)
  - `price` (Number, required)
  - `quantity` (Number, required)
  - `customization` (size, crust, toppings, addOns)
  - `itemTotal` (Number, required)
- `deliveryAddress` (Object: type, name, phone, addressLine1, addressLine2, landmark, city, state, pinCode)
- `pricing` (Object: subtotal, discount, couponCode, deliveryFee, tax, grandTotal)
- `paymentMethod` (String, default: 'Cash on Delivery')
- `paymentStatus` (String, enum: `['PENDING', 'DEMO_PAID', 'PAID', 'FAILED', 'COD', 'Pending', 'Paid']`, default: `'PENDING'`)
- `transactionId` (String)
- `status` (String, enum: `['PLACED', 'ACCEPTED', 'PREPARING', 'BAKING', 'QUALITY_CHECK', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']`, default: `'PLACED'`)
- `deliveryInstructions` (String)
- `estimatedDeliveryMinutes` (Number)
- `statusTimeline` (Array of status-tracking objects)

---

## 2. Categorization of Schema Fields

### Fields Common to Both
- **Customer Name**: Present as `customerName` in Kitchen, and nested under `deliveryAddress.name` in Customer.
- **Items**: Both contain an `items` array. Each item has a `name` and `quantity`.
- **Status**: Both have a status field tracking order progression, though they use different cases (Title Case vs UPPERCASE) and have different intermediate stages.

### Customer-only Fields
- `orderId` (Unique customer-facing order code)
- `customerId` (Authenticated client identifier)
- `deliveryAddress` (Full address specs: phone, street, landmarks, zip code)
- `pricing` (Financial breakdown: subtotal, discount, taxes, grandTotal)
- `paymentMethod`, `paymentStatus`, `transactionId` (Payment ledger data)
- `deliveryInstructions` & `estimatedDeliveryMinutes`
- `statusTimeline` (Timeline tracking updates)
- Detailed item configurations (`id`, `category`, `price`, `customization` details, `itemTotal`)

### Kitchen-only Fields
- `orderNumber` (Acts as the unique kitchen identifier)

---

## 3. Required Fields for Consumers

### Delivery Module Requirements (`delivery.service.js`)
- `orderNumber` or `_id`
- `customerName`
- `items` array containing `name` and `quantity`
- `status` (expects values: `'Ready'`, `'Preparing'`, `'Placed'`, `'Out for Delivery'`, `'Delivered'`)
- `createdAt`

### Customer Module Requirements (`orderService.js`)
- Full detailed customer order payload (detailed customization, pricing, tracking history, address, payment metadata).

---

## 4. Potential Conflicts

1. **Model Overwrite Collision**:
   Mongoose prevents registering two separate schemas under the same model name (`'Order'`). Attempting to register the Customer `'Order'` schema will crash the server with an `OverwriteModelError`.
   
2. **Kitchen Document Saving Data Loss (Critical)**:
   The Kitchen service (`kitchenService.js`) retrieves order documents and calls `await order.save()` during updates. Because the kitchen schema is strict (`strict: true` by default) and unaware of customer-specific fields (like `deliveryAddress`, `pricing`, or detailed items customizations), **Mongoose will strip out all customer fields from the document** when the kitchen updates the status.
   
3. **Status Enum Validation Mismatch**:
   Customer uses UPPERCASE status enums (`'PLACED'`, `'PREPARING'`). Kitchen uses Title Case enums (`'Placed'`, `'Preparing'`). Setting an uppercase status on the shared model will fail the kitchen's validation and crash status updates, or vice versa.

---

## 5. Architectural Recommendation

### Is a single Order collection possible?
**No, a single shared Mongoose collection is not safe** if we are forbidden from modifying the Kitchen module's schema and services. Mongoose's strict validation on the Kitchen model will prune all customer-specific details upon kitchen status saves.

### Recommended Architecture: Decoupled Collection with Dual-Writing & Status Sync

To bypass model name collisions and protect data integrity without altering any other team's codebase:

1. **Separate Model & Collection**:
   Define the customer order model as `'CustomerOrder'` mapping to the `'customer_orders'` collection. This avoids any naming collision and ensures Mongoose compiles both models safely.

2. **Dual-Writing on Placement**:
   When a customer submits an order:
   - Create a `'CustomerOrder'` document in `'customer_orders'` with all customization details, addresses, and pricing.
   - Instantly write a simplified document to the kitchen's `'orders'` collection using the `'Order'` model (dynamically loaded using `mongoose.model("Order")`). Populate `orderNumber` (mapped from `orderId`), `customerName`, `status` (`'Placed'`), and simplified `items` (name and quantity).

3. **Status Synchronization Hook**:
   When the customer requests order status or tracking details:
   - Query both `'CustomerOrder'` and the kitchen `'Order'`.
   - Read the current kitchen order status (e.g. `'Preparing'`, `'Ready'`, `'Out for Delivery'`, `'Delivered'`) and sync it dynamically to update the customer's timeline.
   - This ensures correct delivery/cook workflows while keeping customer details 100% safe from database pruning.

---

## 6. Review of Frontend Store & Contexts

### Is `frontend/src/modules/home/store/` required?
**No, it is not required as a separate subdirectory.**
1. **Customer Context**: We can **completely eliminate** `CustomerContext` because the global `useAuthStore` (Zustand) owned by Team 1 already stores the logged-in customer's details (name, email, phone, token).
2. **Cart & Order Contexts**: We do not need a dedicated `store/` folder. We can place `CartContext.jsx` and `OrderContext.jsx` directly inside `frontend/src/modules/home/` or `frontend/src/modules/home/hooks/` to keep the folder structure clean and modular.
