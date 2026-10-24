# Maincrafts Technology · MERN Stack Internship
## Task 1: Basic React App + API

This project fulfills all requirements for **Task 1: Basic React App + API** of the Maincrafts Technology MERN Stack Internship.

---

## 🎯 Task Objectives & Deliverables Met

- [x] **Frontend (React)**:
  - React application set up with clean, reusable components.
  - Custom `ProductCard` component displaying product name, price, description, category, and availability.
  - Used **props** to pass data seamlessly to child components.
  - Real-time search, category filters, and product creation modal.
- [x] **Backend (Express + MongoDB)**:
  - Express.js server configured with CORS and JSON middleware.
  - Complete RESTful **CRUD API** for `"Products"` (`GET`, `POST`, `GET :id`, `PUT :id`, `DELETE :id`).
  - MongoDB connection using **Mongoose** with schema validations.
  - Starter seeder script (`backend/seeder.js`) to populate realistic sample data with one command.
- [x] **Integration**:
  - React frontend fetches live data from `http://localhost:5000/api/products` using `useEffect` and `useState`.
  - Live backend connection status indicator in the navigation bar.

---

## 📁 Project Architecture

```
Manicraft Internship/
│
├── backend/
│   ├── models/
│   │   └── Product.js          # Mongoose schema & model for Products
│   ├── routes/
│   │   └── productRoutes.js    # Express CRUD endpoints (/api/products)
│   ├── .env                    # Environment variables (port & MongoDB URI)
│   ├── .env.example            # Template for environment configuration
│   ├── package.json            # Backend dependencies & scripts
│   ├── seeder.js               # Database population script
│   └── server.js               # Express server entry point & Mongoose connect
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductCard.jsx # Reusable Card component (uses props)
│   │   │   ├── ProductCard.css # Card styling & animations
│   │   │   ├── Navbar.jsx      # Navigation header with connection status
│   │   │   └── AddProductModal.jsx # Modal to create new products (POST)
│   │   ├── App.jsx             # Main state management & API integration
│   │   ├── App.css             # Main layout, filters, and modal styles
│   │   ├── index.css           # Global typography & design tokens
│   │   └── main.jsx            # React root mount
│   ├── index.html              # HTML entry point with metadata
│   └── package.json            # Frontend dependencies & Vite scripts
│
├── package.json                # Root convenience scripts
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (verified on Node v24)
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) OR a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI.

---

### 2. Configure MongoDB in Backend

Open [`backend/.env`](file:///c:/Users/lokes/OneDrive/Desktop/Manicraft%20Internship/backend/.env):

```env
PORT=5000
# For local MongoDB:
MONGO_URI=mongodb://127.0.0.1:27017/maincrafts_shop

# For MongoDB Atlas (Free Cloud Database):
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/maincrafts_shop?retryWrites=true&w=majority
```

---

### 3. Seed Sample Products (Optional but Recommended)

To quickly load sample products into your database:

```bash
cd backend
npm run seed
```

*Output:*
```
Connected to MongoDB for seeding...
Cleared existing products.
✅ Successfully seeded 6 sample products!
```

---

### 4. Start the Backend Server

```bash
cd backend
npm start
```

*Output:*
```
🚀 Express server running on http://localhost:5000
✅ Connected to MongoDB successfully.
```

The API is now live at `http://localhost:5000/api/products`.

---

### 5. Start the React Frontend

Open a new terminal window:

```bash
cd frontend
npm run dev
```

Open your browser at:
👉 **`http://localhost:5173`**

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch all products (matches sample starter code `Product.find()`) |
| `GET` | `/api/products/:id` | Fetch a single product by MongoDB ID |
| `POST` | `/api/products` | Create a new product (validates `name` and `price`) |
| `PUT` | `/api/products/:id` | Update an existing product |
| `DELETE` | `/api/products/:id` | Delete a product by MongoDB ID |

### Sample POST Request Body:
```json
{
  "name": "Mechanical Keyboard",
  "price": 129.50,
  "description": "RGB tactile mechanical keyboard",
  "category": "Accessories",
  "inStock": true
}
```

---

## 🧩 Reusable Component Demonstration: `ProductCard`

Following the assignment's starter specification:

```jsx
// frontend/src/components/ProductCard.jsx
function ProductCard({
  id,
  name,
  price,
  description,
  category,
  image,
  inStock,
  onDelete
}) {
  return (
    <div className="card product-card">
      <div className="product-card-image-wrap">
        <img src={image} alt={name} />
        <span className="stock-badge">{inStock ? 'In Stock' : 'Out of Stock'}</span>
      </div>
      <div className="product-card-content">
        <h3>{name}</h3>
        <span className="product-price">${price}</span>
        <p>{description}</p>
        <button onClick={() => onDelete(id)}>Delete</button>
      </div>
    </div>
  );
}
```

---

## 🧪 Submission Checklist for Internship

1. [x] Reusable `ProductCard` component displaying data passed via props.
2. [x] Express API route `app.get('/api/products')` querying MongoDB via Mongoose.
3. [x] Frontend `fetch()` / state management handling loading, errors, and live product catalog.
4. [x] Clean dark-theme UI with responsive grid, search bar, and add product modal.
