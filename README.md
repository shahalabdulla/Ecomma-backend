# E—Comma Backend API 🛍️

A premium thrift store REST API built with Node.js, Express, and MongoDB.

## 🌐 Live Demo
- Frontend: [E—Comma Shop](https://ecomma.vercel.app)
- API Base URL: [https://ecomma-backend.onrender.com](https://ecomma-backend.onrender.com)

---

## ✨ Features

- 🔐 JWT Authentication with OTP Email Verification
- 👑 Admin & Customer roles
- 📦 Product management with Cloudinary image upload
- 🛒 Cart system
- 📋 Order management
- 📧 Beautiful branded emails
- ☁️ Cloud-ready (MongoDB Atlas + Cloudinary)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Nodemailer | Email service |
| Cloudinary | Image storage |
| Multer | File upload handling |

---

## 📁 Project Structure
```
e-comm-a/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── utils/
│   │   ├── sendEmail.js
│   │   └── cloudinary.js
│   └── index.js
├── .env.example
├── .gitignore
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Gmail account

### Installation

1. Clone the repository
\```bash
git clone https://github.com/YOURUSERNAME/ecomma-backend.git
cd ecomma-backend
\```

2. Install dependencies
\```bash
npm install
\```

3. Create `.env` file
\```bash
cp .env.example .env
\```

4. Fill in your environment variables
\```env
MONGO_URI=your_mongodb_url
PORT=5000
JWT_SECRET=your_jwt_secret
EMAIL=your_gmail
EMAIL_PASSWORD=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
\```

5. Start the server
\```bash
node src/index.js
\```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/verify-otp` | Verify OTP |
| POST | `/api/auth/resend-otp` | Resend OTP |
| POST | `/api/auth/login` | Login user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Add product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart` | Add to cart |
| PUT | `/api/cart/:productId` | Update quantity |
| DELETE | `/api/cart/:productId` | Remove from cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order |
| GET | `/api/orders/myorders` | Get my orders |
| GET | `/api/orders` | Get all orders (admin) |
| PUT | `/api/orders/:id/status` | Update status (admin) |

---

## 🔐 Environment Variables

Create a `.env.example` file:
\```env
MONGO_URI=
PORT=5000
JWT_SECRET=
EMAIL=
EMAIL_PASSWORD=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
\```

---

## 👨‍💻 Author

**Shahal Abdulla**
- GitHub: [@shahalabdulla](https://github.com/shahalabdulla)

---

## 📄 License
MIT License