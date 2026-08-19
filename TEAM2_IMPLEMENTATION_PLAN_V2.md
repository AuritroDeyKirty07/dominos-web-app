# Team 2 Customer Integration Implementation Plan (V2)

This document provides the updated, corrected technical implementation plan for integrating the Team 2 Customer module from `dominos-final` (source) to `dominos-web-app-main (1)/dominos-web-app-main` (destination). 

It complies strictly with all architectural rules, ensuring that other teams' implementations (Auth, Kitchen, Delivery) are preserved and left untouched.

---

## 1. Mappings of Customer Files

Below is the file-by-file mapping from the source project to the destination repository.

### Backend Mappings

| Source File | Destination File | Action | Reason |
| :--- | :--- | :--- | :--- |
| `backend/config/db.js` | N/A | **IGNORE** | Destination's database connection in `backend/src/shared/config/db.js` must be reused. |
| `backend/config/env.config.js` | N/A | **IGNORE** | Environment variables are handled globally via `process.env` in the destination. |
| `backend/controllers/cartController.js` | `backend/src/modules/order/controllers/cartController.js` | **CREATE & ADAPT** | Adapt to read `customerId` from `req.userId` (from Team 1's auth middleware) instead of body/query or hardcoded ID. |
| `backend/controllers/couponController.js` | `backend/src/modules/order/controllers/couponController.js` | **CREATE** | Move to order controllers. |
| `backend/controllers/customerController.js` | `backend/src/modules/order/controllers/customerController.js` | **CREATE & ADAPT** | Adapt profile and address fetch endpoints to use `req.userId` context. |
| `backend/controllers/menuController.js` | `backend/src/modules/order/controllers/menuController.js` | **CREATE** | Expose catalog endpoints. |
| `backend/controllers/orderController.js` | `backend/src/modules/order/controllers/orderController.js` | **CREATE & ADAPT** | Adapt to fetch/save customer order details using the new `'CustomerOrder'` model, and conditionally sync/write basic entries to Team 3's `'Order'` model. |
| `backend/controllers/paymentController.js` | N/A | **DO NOT INTEGRATE** | Exclude old Customer backend payment controller as requested. |
| `backend/middleware/errorHandler.js` | N/A | **IGNORE** | Rely on destination's central logging and express error handling. |
| `backend/middleware/validator.js` | `backend/src/modules/order/middleware/validator.js` | **CREATE & ADAPT** | Keep request validators local to the order module. |
| `backend/models/Address.js` | `backend/src/modules/order/models/Address.js` | **CREATE & ADAPT** | Keep address as a separate schema referencing `userId` to avoid modifying Team 1's User schema. |
| `backend/models/Cart.js` | `backend/src/modules/order/models/Cart.js` | **CREATE & ADAPT** | Create card schema with `customerId` as `mongoose.Schema.Types.ObjectId` referencing `User`. |
| `backend/models/Coupon.js` | `backend/src/modules/order/models/Coupon.js` | **CREATE** | Standard Coupon schema. |
| `backend/models/Customer.js` | `backend/src/modules/order/models/Customer.js` | **CREATE & ADAPT** | Create a separate `Customer` profile model (storing loyalty points, preferences) referencing `userId` (User model) to avoid modifying Team 1's User model. |
| `backend/models/MenuItem.js` | `backend/src/modules/order/models/MenuItem.js` | **CREATE** | Standalone MenuItem model. |
| `backend/models/Order.js` | `backend/src/modules/order/models/Order.js` | **CREATE & ADAPT** | **RENAME CONFLICT**: Rename this model to `'CustomerOrder'` (registered as `CustomerOrder` in `backend/src/modules/order/models/CustomerOrder.js`) to prevent collision with Team 3's `'Order'` model. |
| `backend/models/Payment.js` | N/A | **DO NOT INTEGRATE** | Excluded backend payment model. |
| `backend/routes/cartRoutes.js` | `backend/src/modules/order/routes/cartRoutes.js` | **CREATE & ADAPT** | Protect routes with `isAuthMiddleware` and `hasRole(['customer'])`. |
| `backend/routes/couponRoutes.js` | `backend/src/modules/order/routes/couponRoutes.js` | **CREATE** | Coupon routes. |
| `backend/routes/customerRoutes.js` | `backend/src/modules/order/routes/customerRoutes.js` | **CREATE & ADAPT** | Expose customer profiles and addresses. Protect with `isAuthMiddleware`. |
| `backend/routes/index.js` | `backend/src/modules/order/routes/index.js` | **CREATE & ADAPT** | Consolidated router for the order module. |
| `backend/routes/menuRoutes.js` | `backend/src/modules/order/routes/menuRoutes.js` | **CREATE** | Menu routes. |
| `backend/routes/orderRoutes.js` | `backend/src/modules/order/routes/orderRoutes.js` | **CREATE & ADAPT** | Expose customer order routes. Protect with `isAuthMiddleware` and `hasRole(['customer'])`. |
| `backend/routes/paymentRoutes.js` | N/A | **DO NOT INTEGRATE** | Excluded payment routes. |
| `backend/services/cartService.js` | `backend/src/modules/order/services/cartService.js` | **CREATE & ADAPT** | Operations on cart items. |
| `backend/services/couponService.js` | `backend/src/modules/order/services/couponService.js` | **CREATE** | Coupon validation operations. |
| `backend/services/customerService.js` | `backend/src/modules/order/services/customerService.js` | **CREATE & ADAPT** | Manage profile details and addresses referencing the User ID. |
| `backend/services/menuService.js` | `backend/src/modules/order/services/menuService.js` | **CREATE** | Fetch items from MenuItem collections. |
| `backend/services/orderService.js` | `backend/src/modules/order/services/orderService.js` | **CREATE & ADAPT** | CRUD operations for `'CustomerOrder'` collection and sync hooks for Team 3's `'Order'`. |
| `backend/services/paymentService.js` | N/A | **DO NOT INTEGRATE** | Excluded backend payment service. |
| `backend/utils/apiResponse.js` | `backend/src/modules/order/utils/apiResponse.js` | **CREATE** | API helpers. |
| `backend/utils/constants.js` | `backend/src/modules/order/utils/constants.js` | **CREATE** | Standalone order status constants. |
| `backend/server.js` | N/A | **IGNORE** | App setup is managed by `backend/src/app.js`. |

---

### Frontend Mappings

| Source File | Destination File | Action | Reason |
| :--- | :--- | :--- | :--- |
| `frontend/index.html` | `frontend/index.html` | **MERGE** | Append script tag `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>` to body. |
| `frontend/package.json` | N/A | **IGNORE** | Rely on existing package list in destination. |
| `frontend/postcss.config.js` | N/A | **IGNORE** | Managed by Vite and Tailwind CSS v4 in the destination. |
| `frontend/tailwind.config.js` | N/A | **IGNORE** | Styles will be integrated in `frontend/src/index.css` via `@theme`. |
| `frontend/src/index.css` | `frontend/src/index.css` | **MERGE** | Append custom color schemes, font definitions, and box shadows under `@theme`. |
| `frontend/src/App.jsx` | N/A | **IGNORE** | Shared structure in destination is preserved. |
| `frontend/src/main.jsx` | N/A | **IGNORE** | Preserved. |
| `frontend/src/components/address/*` | `frontend/src/modules/home/components/address/*` | **CREATE** | Move address components. |
| `frontend/src/components/common/*` | `frontend/src/modules/home/components/common/*` | **CREATE & ADAPT** | Move core helpers (`EmptyState.jsx`, `Spinner.jsx`, `VegBadge.jsx`, `Modal.jsx`). Reuse destination's shadcn/ui components (`Button`, `Card`, etc.) where appropriate. |
| `frontend/src/components/layout/CustomerLayout.jsx` | `frontend/src/modules/home/components/layout/CustomerLayout.jsx` | **CREATE & ADAPT** | Adapts to render layout nested container. |
| `frontend/src/components/layout/Footer.jsx` | `frontend/src/modules/home/components/layout/Footer.jsx` | **CREATE** | Customer footer. |
| `frontend/src/components/layout/LocationSelectorModal.jsx` | `frontend/src/modules/home/components/layout/LocationSelectorModal.jsx` | **CREATE** | Select location popup. |
| `frontend/src/components/layout/Navbar.jsx` | N/A | **IGNORE** | Navbar functionality will be integrated into the shared Navbar. |
| `frontend/src/components/menu/*` | `frontend/src/modules/home/components/menu/*` | **CREATE** | Category selectors and pizza customizer modals. |
| `frontend/src/components/order/*` | `frontend/src/modules/home/components/order/*` | **CREATE** | Move live order tracker list widgets. |
| `frontend/src/config/api.config.js` | `frontend/src/modules/home/config/api.config.js` | **CREATE & ADAPT** | Point paths to destination URL endpoints. |
| `frontend/src/hooks/*` | `frontend/src/modules/home/hooks/*` | **CREATE** | Core hooks (`useCart.js`, `useCustomer.js`, `useOrders.js`). |
| `frontend/src/pages/*` | `frontend/src/modules/home/pages/*` | **CREATE & ADAPT** | Move 12 customer pages. Adapt them to import the centralized Axios instance. |
| `frontend/src/routes/AppRoutes.jsx` | `frontend/src/routes/AppRoutes.jsx` | **MERGE** | Add customer paths under `ProtectedRoute` checking for the `'customer'` role. Do not replace the file. |
| `frontend/src/services/apiClient.js` | N/A | **IGNORE** | Replace with destination's central `axiosInstance` (`frontend/src/shared/api/axiosInstance.js`). |
| `frontend/src/services/razorpayService.js` | `frontend/src/modules/home/services/razorpayService.js` | **CREATE** | **PRESERVED**: Contains frontend-only Razorpay checkout helper. |
| `frontend/src/services/*` | `frontend/src/modules/home/services/*` | **CREATE & ADAPT** | Adapt services to invoke Axios client instance. |
| `frontend/src/store/CartContext.jsx` | `frontend/src/modules/home/store/CartContext.jsx` | **CREATE** | **REQUIRED**: Dynamic cart details and customizer pricing math are managed here; no equivalent store exists in the destination. |
| `frontend/src/store/CustomerContext.jsx` | N/A | **IGNORE** | **REUSE**: Profile state is retrieved dynamically from the global `useAuthStore` provided by Team 1. |
| `frontend/src/store/OrderContext.jsx` | `frontend/src/modules/home/store/OrderContext.jsx` | **CREATE** | **REQUIRED**: Customer-facing active order state tracker. |
| `frontend/src/utils/*` | `frontend/src/modules/home/utils/*` | **CREATE** | Move helper functions. |

---

## 2. Shared File Modifications & Preservations

To respect other teams' scopes, the following rules will be strictly enforced during merging:

1. **`backend/src/app.js` (Merge)**:
   - Append the registration of the order router: `app.use("/api", orderRouter)`.
   - Preserve all existing routes, middlewares, and imports (Kitchen, Delivery, Auth).
2. **`frontend/src/routes/AppRoutes.jsx` (Merge)**:
   - Import customer pages and register their paths.
   - Protect them using the existing `ProtectedRoute` structure.
   - Preserve all other teams' routes (Kitchen, Delivery, Profile, Reset Password) completely untouched.
3. **`frontend/src/shared/components/Navbar.jsx` (Preserve/Merge)**:
   - Do NOT overwrite the shared Navbar.
   - Merge detailed customer parameters (Location Selector trigger, Loyalty points bubble, active cart items bubble) conditionally: render them only when the user is logged in and has the `'customer'` role. Other roles (cook, delivery, admin) will see the standard navbar links.
4. **`frontend/src/index.css` (Merge)**:
   - Do NOT blindly overwrite the file.
   - Append the Tailwind CSS v4 `@theme` configuration at the bottom to inject branding properties:
     ```css
     @theme {
       --color-dominos-blue: #006491;
       --color-dominos-red: #E31837;
       --color-dominos-dark: #0C1E28;
       ...
     }
     ```

---

## 3. Authentication & ID Adaptations

1. **Team 1 Middleware Integration**:
   - Verify: `backend/src/shared/middleware/auth-middleware.js` exports `isAuthMiddleware` and sets `req.userId = decodedPayload.userId;`.
   - Verify: `backend/src/shared/middleware/rbac-middleware.js` exports `hasRole`.
   - **Action**: Protect all cart, address, and order backend endpoints with `isAuthMiddleware` and `hasRole(['customer'])`.
2. **Replacing Hardcoded `'CUST-8839'` ID**:
   - All backend queries, updates, and creation operations will read `req.userId` to reference the logged-in customer user document ID.
   - Standalone fallback objects in `customerService.js` and `orderService.js` will be removed or refactored to query MongoDB collections by the user's ObjectId.

---

## 4. Architectural Conflicts Requiring User Approval

The following critical database/model conflict has been identified:

### Shared 'Order' Model Collision (Conflict & Resolution)

- **The Problem**:
  - Team 3 (Kitchen) registers a model named `'Order'` using `backend/src/modules/kitchen/models/Order.js`.
  - Team 2 (Customer) also registers a model named `'Order'` inside `backend/models/Order.js`.
  - In Mongoose, compiling two models with the same name `'Order'` but different schemas will trigger a run-time crash: `OverwriteModelError: Cannot overwrite 'Order' model once compiled.`
  - However, we are forbidden from modifying Team 3's `Order.js` model.

- **Proposed Approval-Required Solution**:
  - We will rename Team 2's Mongoose model to `'CustomerOrder'` and register it inside `backend/src/modules/order/models/CustomerOrder.js`.
  - When a customer places an order:
    1. We save the detailed customer invoice, customization, and timeline details inside the `'CustomerOrder'` collection.
    2. We invoke Team 3's `'Order'` model internally and write a basic order document (containing `orderNumber`, `customerName`, simple `items` list with quantities, and `status`) to the `'Order'` collection.
  - This enables Team 3 (Kitchen) and Team 4 (Delivery) to view and prepare the order through their existing code without changing a single line of their models, controllers, or database calls, while Team 2 (Customer) enjoys a fully operational tracking and customization system.

---

## 5. Next Steps

1. Stop and wait for user approval of this updated V2 plan and the proposed database collision resolution.
2. Once approved, execute the file creations and merges.
3. Verify the build and create the walkthrough and implementation reports.
