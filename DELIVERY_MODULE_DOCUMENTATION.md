# Delivery Management Module - Complete Documentation

## Overview
Complete delivery management system for Smart Book Sharing platform with order tracking, payment escrow, and role-based access control.

---

## 📁 Project Structure

```
backend/
├── models/
│   └── Order.js                    ✅ Updated with all fields
├── controllers/
│   └── orderController.js          ✅ Complete CRUD operations
└── routes/
    └── orderRoutes.js              ✅ All endpoints configured

frontend/
├── components/
│   └── delivery/
│       ├── DeliveryManagementComplete.jsx  ✅ Main component
│       ├── DeliveryTracker.jsx             ✅ Progress tracker
│       └── OrderTrackingWidget.jsx         ✅ Compact widget
└── services/
    └── orderService.js             ✅ API integration
```

---

## 🗄️ Database Schema (Order Model)

### Fields:

```javascript
{
  // Book Details
  bookId: ObjectId (ref: 'Listing', required)
  bookTitle: String
  bookImage: String
  
  // Buyer Details
  buyerId: ObjectId (ref: 'User', required)
  buyerName: String
  buyerEmail: String
  deliveryAddress: String (required)
  
  // Seller Details
  sellerId: ObjectId (ref: 'User', required)
  sellerName: String
  
  // Order Details
  amount: Number (required)
  
  // Payment Details
  paymentMethod: Enum ['cod', 'online'] (default: 'online')
  paymentStatus: Enum ['Pending', 'Paid', 'Released'] (default: 'Pending')
  razorpayOrderId: String
  razorpayPaymentId: String
  
  // Delivery Details
  deliveryStatus: Enum ['Pending', 'Shipped', 'Out for Delivery', 'Delivered'] (default: 'Pending')
  trackingId: String (unique, auto-generated)
  estimatedDeliveryDate: Date (auto: +5 days)
  actualDeliveryDate: Date
  
  // Additional
  notes: String
  
  // Timestamps
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### Auto-Generated Fields:
- **trackingId**: Format `TRK` + 6 random digits (e.g., TRK123456)
- **estimatedDeliveryDate**: Current date + 5 days
- **timestamps**: Automatically managed by Mongoose

---

## 🔌 API Endpoints

### Base URL: `https://online-book-sharing-system-backend.onrender.com/api/orders`

All routes require authentication token in header:
```
Authorization: Bearer <token>
```

---

### 1️⃣ Create Order (POST `/`)

**Description**: Create order after successful Razorpay payment

**Request Body**:
```json
{
  "bookId": "64abc123...",
  "bookTitle": "Introduction to Algorithms",
  "bookImage": "https://...",
  "buyerName": "John Doe",
  "buyerEmail": "john@example.com",
  "deliveryAddress": "123 Main St, City, State 12345",
  "amount": 850,
  "paymentMethod": "online",
  "razorpayOrderId": "order_xyz123",
  "razorpayPaymentId": "pay_abc456",
  "sellerId": "64def456...",
  "sellerName": "BookStore Library"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "64ghi789...",
    "trackingId": "TRK123456",
    "deliveryStatus": "Pending",
    "paymentStatus": "Paid",
    "estimatedDeliveryDate": "2024-01-15T00:00:00.000Z",
    ...
  }
}
```

---

### 2️⃣ Get Single Order (GET `/:id`)

**Description**: Fetch order details by ID

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "64ghi789...",
    "trackingId": "TRK123456",
    "bookTitle": "Introduction to Algorithms",
    "deliveryStatus": "Shipped",
    "paymentStatus": "Paid",
    "amount": 850,
    "buyerName": "John Doe",
    "sellerName": "BookStore Library",
    "deliveryAddress": "123 Main St...",
    "estimatedDeliveryDate": "2024-01-15T00:00:00.000Z",
    "createdAt": "2024-01-10T10:30:00.000Z",
    "updatedAt": "2024-01-11T14:20:00.000Z"
  }
}
```

---

### 3️⃣ Mark as Shipped (PUT `/ship/:id`)

**Description**: Seller marks order as shipped

**Authorization**: Only seller can perform this action

**Conditions**:
- User must be the seller
- Current status must be 'Pending'
- Payment status must be 'Paid'

**Response**:
```json
{
  "success": true,
  "message": "Order marked as shipped",
  "data": {
    "_id": "64ghi789...",
    "deliveryStatus": "Shipped",
    ...
  }
}
```

**Error Responses**:
```json
// Not authorized
{
  "success": false,
  "message": "Only seller can mark as shipped"
}

// Already shipped
{
  "success": false,
  "message": "Order is already shipped"
}
```

---

### 4️⃣ Update Delivery Status (PUT `/update-status/:id`)

**Description**: Update delivery status (for admin/delivery partner)

**Request Body**:
```json
{
  "deliveryStatus": "Out for Delivery"
}
```

**Valid Status Values**:
- `Pending`
- `Shipped`
- `Out for Delivery`
- `Delivered`

**Response**:
```json
{
  "success": true,
  "message": "Delivery status updated",
  "data": {
    "_id": "64ghi789...",
    "deliveryStatus": "Out for Delivery",
    ...
  }
}
```

**Note**: When status is set to 'Delivered', `actualDeliveryDate` is automatically set.

---

### 5️⃣ Confirm Delivery (PUT `/confirm/:id`)

**Description**: Buyer confirms delivery and releases payment to seller

**Authorization**: Only buyer can perform this action

**Conditions**:
- User must be the buyer
- Delivery status must be 'Delivered'
- Payment status must not already be 'Released'

**Response**:
```json
{
  "success": true,
  "message": "Delivery confirmed and payment released to seller",
  "data": {
    "_id": "64ghi789...",
    "paymentStatus": "Released",
    "actualDeliveryDate": "2024-01-14T16:45:00.000Z",
    ...
  }
}
```

**Error Responses**:
```json
// Not authorized
{
  "success": false,
  "message": "Only buyer can confirm delivery"
}

// Not delivered yet
{
  "success": false,
  "message": "Order must be delivered first"
}

// Already confirmed
{
  "success": false,
  "message": "Payment already released"
}
```

---

## ⚛️ React Components

### 1. DeliveryManagementComplete Component

**Location**: `src/components/delivery/DeliveryManagementComplete.jsx`

**Usage**:
```jsx
import { DeliveryManagementComplete } from '../components/delivery/DeliveryManagementComplete';

<DeliveryManagementComplete 
  orderId="64ghi789..." 
  userRole="buyer" // or "seller"
/>
```

**Features**:
- ✅ Displays tracking ID with copy functionality
- ✅ Shows delivery progress bar with 4 stages
- ✅ Real-time status updates
- ✅ Role-based action buttons
- ✅ Order timeline
- ✅ Payment status indicator
- ✅ Estimated delivery date
- ✅ Success/error notifications

**Props**:
- `orderId` (string, required): Order ID to display
- `userRole` (string, optional): 'buyer' or 'seller' for role-based UI

---

### 2. DeliveryTracker Component

**Location**: `src/components/delivery/DeliveryTracker.jsx`

**Usage**:
```jsx
import { DeliveryTracker } from '../components/delivery/DeliveryTracker';

<DeliveryTracker order={orderObject} />
```

**Features**:
- Progress bar with 4 stages
- Current status highlight
- Order timeline
- Estimated delivery date

---

### 3. OrderTrackingWidget Component

**Location**: `src/components/delivery/OrderTrackingWidget.jsx`

**Usage**:
```jsx
import { OrderTrackingWidget } from '../components/delivery/OrderTrackingWidget';

// Compact version
<OrderTrackingWidget order={orderObject} compact={true} />

// Full version
<OrderTrackingWidget order={orderObject} />
```

---

## 🔐 Role-Based Access Control

### Seller Actions:
- ✅ Mark order as 'Shipped' (only when status is 'Pending')
- ✅ View all orders where they are the seller

### Buyer Actions:
- ✅ Confirm delivery (only when status is 'Delivered')
- ✅ Release payment to seller
- ✅ View all orders where they are the buyer

### Admin/Delivery Partner Actions:
- ✅ Update delivery status to any valid status
- ✅ View all orders

---

## 🔄 Order Flow

```
1. Payment Success (Razorpay)
   ↓
2. Order Created Automatically
   - paymentStatus = "Paid"
   - deliveryStatus = "Pending"
   - trackingId = "TRK123456"
   - estimatedDeliveryDate = +5 days
   ↓
3. Seller Marks as Shipped
   - deliveryStatus = "Shipped"
   ↓
4. Delivery Partner Updates Status
   - deliveryStatus = "Out for Delivery"
   ↓
5. Delivery Partner Marks Delivered
   - deliveryStatus = "Delivered"
   - actualDeliveryDate = current date
   ↓
6. Buyer Confirms Delivery
   - paymentStatus = "Released"
   - Payment released to seller
```

---

## 💳 Payment Escrow System

### How it works:

1. **Payment Made**: Buyer pays via Razorpay
   - Money held in escrow
   - `paymentStatus = "Paid"`

2. **Order Processing**: Seller ships the book
   - Money still in escrow
   - `deliveryStatus = "Shipped"`

3. **Delivery Confirmation**: Buyer confirms receipt
   - Money released to seller
   - `paymentStatus = "Released"`

### Benefits:
- ✅ Protects buyer from non-delivery
- ✅ Protects seller from non-payment
- ✅ Builds trust in marketplace

---

## 🧪 Testing the System

### Test Scenario 1: Complete Order Flow

```javascript
// 1. Create order after payment
POST /api/orders
{
  "bookId": "...",
  "amount": 850,
  "deliveryAddress": "123 Main St",
  ...
}

// 2. Seller marks as shipped
PUT /api/orders/ship/{orderId}

// 3. Update to out for delivery
PUT /api/orders/update-status/{orderId}
{
  "deliveryStatus": "Out for Delivery"
}

// 4. Mark as delivered
PUT /api/orders/update-status/{orderId}
{
  "deliveryStatus": "Delivered"
}

// 5. Buyer confirms delivery
PUT /api/orders/confirm/{orderId}
```

---

## 🎨 UI Features

### Progress Bar:
- 4 stages with icons
- Animated transitions
- Color-coded status
- Current step highlighted

### Tracking ID:
- Unique format: TRK + 6 digits
- Copy to clipboard functionality
- Displayed prominently

### Action Buttons:
- Role-based visibility
- Loading states
- Disabled when not applicable
- Success/error feedback

### Status Indicators:
- Color-coded badges
- Payment status
- Delivery status
- Timeline view

---

## 🚀 Integration with Razorpay

### Payment Flow:

```javascript
// 1. Create Razorpay order
const razorpayOrder = await razorpay.orders.create({
  amount: amount * 100,
  currency: 'INR'
});

// 2. Show Razorpay checkout
const options = {
  key: RAZORPAY_KEY_ID,
  amount: razorpayOrder.amount,
  order_id: razorpayOrder.id,
  handler: async (response) => {
    // 3. Verify payment and create order
    await orderService.processPaymentAndCreateOrder(
      {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      },
      orderData
    );
  }
};

const rzp = new Razorpay(options);
rzp.open();
```

---

## 📝 Environment Variables

Add to `.env`:

```env
# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# MongoDB
MONGODB_URI=mongodb://localhost:27017/bookshare

# JWT
JWT_SECRET=your_jwt_secret

# Server
PORT=5001
NODE_ENV=development
```

---

## ✅ Checklist

### Backend:
- ✅ Order model with all required fields
- ✅ Tracking ID auto-generation
- ✅ Timestamps enabled
- ✅ Create order endpoint
- ✅ Get order endpoint
- ✅ Mark as shipped endpoint
- ✅ Update status endpoint
- ✅ Confirm delivery endpoint
- ✅ Role-based middleware
- ✅ Error handling
- ✅ Async/await pattern

### Frontend:
- ✅ DeliveryManagementComplete component
- ✅ DeliveryTracker component
- ✅ OrderTrackingWidget component
- ✅ Order service with all API calls
- ✅ Progress bar animation
- ✅ Tracking ID display
- ✅ Copy to clipboard
- ✅ Role-based buttons
- ✅ Success/error notifications
- ✅ Loading states

---

## 🎯 Key Features Summary

1. ✅ **Automatic Order Creation** after Razorpay payment
2. ✅ **Auto-generated Tracking IDs** (TRK + 6 digits)
3. ✅ **4-Stage Delivery Progress** (Pending → Shipped → Out for Delivery → Delivered)
4. ✅ **Role-Based Access Control** (Seller/Buyer/Admin)
5. ✅ **Payment Escrow System** (Paid → Released)
6. ✅ **Estimated Delivery Date** (+5 days auto-calculated)
7. ✅ **Real-time Status Updates**
8. ✅ **Complete Order Timeline**
9. ✅ **Responsive UI Components**
10. ✅ **Production-Ready Code** with error handling

---

## 📞 API Call Examples

### Using Fetch:

```javascript
// Get order
const response = await fetch(`https://online-book-sharing-system-backend.onrender.com/api/orders/${orderId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();

// Mark as shipped
const response = await fetch(`https://online-book-sharing-system-backend.onrender.com/api/orders/ship/${orderId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();

// Confirm delivery
const response = await fetch(`https://online-book-sharing-system-backend.onrender.com/api/orders/confirm/${orderId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## 🎉 Complete & Production Ready!

All components are fully functional and ready for production use. The system includes:
- Complete backend API
- React components with animations
- Role-based access control
- Payment escrow system
- Real-time tracking
- Error handling
- Loading states
- Responsive design

**Status**: ✅ COMPLETE & WORKING
