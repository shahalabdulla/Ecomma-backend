# E—Comma Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)
![Render](https://img.shields.io/badge/Deployed%20on%20Render-46E3B7?style=flat&logo=render&logoColor=white)

A RESTful API for E—Comma, a full-stack clothing(thrift) store application. Built with Node.js and Express, featuring JWT authentication, OTP email verification, role-based access control, and Cloudinary image storage.

**Live API:** https://ecomma-backend.onrender.com

---

## Features

- JWT-based authentication with OTP email verification
- Role-based access control (Admin / Customer)
- Product management with multi-image upload via Cloudinary
- Shopping cart system
- Order management with status tracking
- Branded transactional emails via Nodemailer
- Rate limiting and security headers via Helmet
- Input validation and CORS protection

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM for MongoDB |
| JSON Web Token | Authentication |
| Bcrypt | Password hashing |
| Nodemailer | Transactional emails |
| Cloudinary | Image storage |
| Multer | File upload handling |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |

---

## Project Structure
```
src/
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── middleware/
│   └── authMiddleware.js
├── utils/
│   ├── sendEmail.js
│   └── cloudinary.js
└── index.js
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Gmail account with App Password enabled

### Installation

1. Clone the repository
```bash
git clone https://github.com/shahalabdulla/ecomma-backend.git
cd ecomma-backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

4. Start the development server
```bash
node src/index.js
```

---

## Environment Variables
```env
MONGO_URI=
PORT=5000
JWT_SECRET=
EMAIL=
EMAIL_PASSWORD=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## API Reference

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/verify-otp` | Verify OTP code | Public |
| POST | `/api/auth/resend-otp` | Resend OTP code | Public |
| POST | `/api/auth/login` | Login user | Public |

### Products

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get single product | Public |
| POST | `/api/products` | Create product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Cart

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/cart` | Get user cart | Private |
| POST | `/api/cart` | Add item to cart | Private |
| PUT | `/api/cart/:productId` | Update quantity | Private |
| DELETE | `/api/cart/:productId` | Remove item | Private |

### Orders

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/orders` | Place order | Private |
| GET | `/api/orders/myorders` | Get my orders | Private |
| GET | `/api/orders` | Get all orders | Admin |
| PUT | `/api/orders/:id/status` | Update order status | Admin |

---

## Security

- Passwords hashed using bcrypt
- JWT tokens expire after 7 days
- Rate limiting on all routes (100 req/15min)
- Stricter rate limiting on auth routes (10 req/15min)
- CORS restricted to frontend domain only
- Security headers via Helmet
- Input validation on all user inputs

---

## Related

- Frontend Repository: [ecomma-frontend](https://github.com/shahalabdulla/ecomma-frontend)
- Live Demo: [E—Comma](https://ecomma-frontend.vercel.app)

---

## Author

**Shah Al Abdulla**
GitHub: [@shahalabdulla](https://github.com/shahalabdulla)

---

## License

MIT