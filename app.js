import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import session from 'express-session';
import { body, validationResult } from 'express-validator';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import FormData from 'form-data';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const API_BASE_URL = process.env.API_BASE_URL;

// Multer configuration for image uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 24 * 60 * 60 * 1000 
    },
  })
);

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Auth middleware - FIXED: Check both session and token
function isAdmin(req, res, next) {
  if (req.session.isAdmin && req.session.adminToken) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

// ===== API SERVICE - FIXED: Persist token from session =====
const apiService = {
  getToken(req) {
    return req.session.adminToken || null;
  },

  async get(endpoint, req, headers = {}) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };
      
      const token = this.getToken(req);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const res = await axios.get(`${API_BASE_URL}${endpoint}`, config);
      return res.data;
    } catch (err) {
      console.error(`GET ${endpoint} error:`, err.response?.data || err.message);
      if (err.response?.status === 401 && req) {
        req.session.destroy();
      }
      return null;
    }
  },
  
  async post(endpoint, data, req, headers = {}) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };
      
      const token = this.getToken(req);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const res = await axios.post(`${API_BASE_URL}${endpoint}`, data, config);
      return res.data;
    } catch (err) {
      console.error(`POST ${endpoint} error:`, err.response?.data || err.message);
      if (err.response?.status === 401 && req) {
        req.session.destroy();
      }
      throw err;
    }
  },
  
  async put(endpoint, data, req, headers = {}) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };
      
      const token = this.getToken(req);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const res = await axios.put(`${API_BASE_URL}${endpoint}`, data, config);
      return res.data;
    } catch (err) {
      console.error(`PUT ${endpoint} error:`, err.response?.data || err.message);
      if (err.response?.status === 401 && req) {
        req.session.destroy();
      }
      throw err;
    }
  },
  
  async delete(endpoint, req, headers = {}) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };
      
      const token = this.getToken(req);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const res = await axios.delete(`${API_BASE_URL}${endpoint}`, config);
      return res.data;
    } catch (err) {
      console.error(`DELETE ${endpoint} error:`, err.response?.data || err.message);
      if (err.response?.status === 401 && req) {
        req.session.destroy();
      }
      throw err;
    }
  },
};

// ===== HELPER =====
const getFeaturedProducts = (products) =>
  Array.isArray(products) ? products.filter((p) => p.featured).slice(0, 6) : [];

// ===== PUBLIC ROUTES =====

// Home
app.get('/', async (req, res) => {
  try {
    const [products, categories, brands] = await Promise.all([
      apiService.get('/products', req),
      apiService.get('/categories', req),
      apiService.get('/brands', req),
    ]);

    const featuredProducts = getFeaturedProducts(products?.products || []);
    const brandList = Array.isArray(brands)
      ? brands.slice(0, 6)
      : brands?.brands?.slice(0, 6) || [];
    const categoryList = Array.isArray(categories)
      ? categories
      : categories?.categories || [];

    res.render('index', {
      title: 'Home - Mabs Electronics',
      categories: categoryList,
      featuredProducts,
      brands: brandList,
    });
  } catch (error) {
    console.error('Error loading homepage:', error);
    res.status(500).render('500', {
      title: 'Server Error',
      message: 'Unable to load homepage. Please try again later.',
    });
  }
});

// Products page
app.get('/products', async (req, res) => {
  try {
    const products = await apiService.get('/products', req);
    res.render('products', {
      title: 'All Products',
      products: products?.products || [],
    });
  } catch (err) {
    console.error('Error loading products:', err);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to load products. Please try again later.' 
    });
  }
});

// Single product
app.get('/product/:id', async (req, res) => {
  try {
    const product = await apiService.get(`/products/${req.params.id}`, req);
    if (!product)
      return res.status(404).render('404', { 
        title: 'Not Found', 
        message: 'Product not found.' 
      });
    res.render('product', { 
      title: product.title, 
      product 
    });
  } catch (err) {
    console.error('Error loading product:', err);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to load product. Please try again later.' 
    });
  }
});

// Categories page
app.get('/categories', async (req, res) => {
  try {
    const categories = await apiService.get('/categories', req);
    const categoryList = categories?.categories || categories || [];
    res.render('categories', {
      title: 'Categories',
      categories: categoryList,
    });
  } catch (err) {
    console.error('Error loading categories:', err);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to load categories. Please try again later.' 
    });
  }
});

// Products by category
app.get('/category/:id', async (req, res) => {
  try {
    const products = await apiService.get(`/products/category/${req.params.id}`, req);
    res.render('category', {
      title: 'Category Products',
      products: products?.products || products || [],
    });
  } catch (err) {
    console.error('Error loading category:', err);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to load category. Please try again later.' 
    });
  }
});

// Brands page
app.get('/brands', async (req, res) => {
  try {
    const [brands, products] = await Promise.all([
      apiService.get('/brands', req),
      apiService.get('/products', req),
    ]);

    const brandList = Array.isArray(brands) ? brands : brands?.brands || [];
    const productList = Array.isArray(products) ? products : products?.products || [];

    const brandProducts = {};
    brandList.forEach((brand) => {
      const brandId = brand._id || brand.id;
      const brandName = brand.name;
      
      const filtered = productList.filter((p) => p.brand === brandName);
      
      brandProducts[brandId] = filtered;
      brandProducts[brandName] = filtered;
    });

    res.render('brands', {
      title: 'Shop by Brand',
      brands: brandList,
      brandProducts,
    });
  } catch (err) {
    console.error('Error loading brands:', err);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to load brands. Please try again later.' 
    });
  }
});

// About, Cart, Search, Contact
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

app.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  res.render('cart', { title: 'My Cart', cart });
});

app.get('/search', async (req, res) => {
  const q = req.query.q || '';
  try {
    const results = await apiService.get(`/products?search=${q}`, req);
    const searchResults = Array.isArray(results) ? results : results?.products || [];
    
    res.render('search', {
      title: `Search results for "${q}"`,
      products: searchResults,
      query: q,
      results: searchResults,
    });
  } catch (err) {
    console.error('Error searching:', err);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to perform search. Please try again later.' 
    });
  }
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us',
    success: null,
    error: null,
    errors: [],
  });
});

app.post(
  '/contact',
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message cannot be empty'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('contact', {
        title: 'Contact Us',
        success: null,
        error: null,
        errors: errors.array(),
      });
    }

    try {
      await apiService.post('/contact', req.body, req);
      res.render('contact', {
        title: 'Contact Us',
        success: 'Thank you for contacting us! We\'ll get back to you soon.',
        error: null,
        errors: [],
      });
    } catch (error) {
      console.error('Contact form error:', error.message);
      res.render('contact', {
        title: 'Contact Us',
        success: null,
        error: 'Something went wrong. Please try again later.',
        errors: [],
      });
    }
  }
);

// ===== ADMIN ROUTES =====

app.get('/admin/login', (req, res) => {
  res.render('adminLogin', { 
    title: 'Admin Login',
    error: null,
  });
});

app.post(
  '/admin/login',
  body('username').notEmpty(),
  body('password').notEmpty(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).render('adminLogin', { 
          title: 'Admin Login', 
          error: 'Please enter both username and password',
        });

      const { username, password } = req.body;

      console.log(`🔐 Attempting login for: ${username}`);
      console.log(`📡 API URL: ${API_BASE_URL}/admin/login`);

      const backendRes = await axios.post(
        `${API_BASE_URL}/admin/login`,
        { username, password },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );
      
      console.log('✅ Backend login successful');
      
      const token = backendRes.data.token;
      req.session.adminToken = token;
      req.session.isAdmin = true;
      req.session.adminUsername = username;
      
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
        }
        console.log(`✅ Session saved, redirecting to dashboard`);
        res.redirect('/admin/dashboard');
      });
      
    } catch (err) {
      console.error('❌ Admin login error:', err.response?.data || err.message);
      res.render('adminLogin', {
        title: 'Admin Login',
        error: err.response?.data?.message || 'Invalid username or password. Please check your credentials.',
      });
    }
  }
);

app.get('/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Session error:', err);
    res.redirect('/admin/login');
  });
});

app.get('/admin/dashboard', isAdmin, async (req, res) => {
  try {
    const [products, categories, brands] = await Promise.all([
      apiService.get('/products', req),
      apiService.get('/categories', req),
      apiService.get('/brands', req),
    ]);

    const productList = Array.isArray(products) ? products : products?.products || [];
    const categoryList = Array.isArray(categories) ? categories : categories?.categories || [];
    const brandList = Array.isArray(brands) ? brands : brands?.brands || [];

    const stats = {
      totalProducts: productList.length,
      totalCategories: categoryList.length,
      totalBrands: brandList.length,
      featuredProducts: productList.filter((p) => p.featured).length,
    };

    res.render('adminDashboard', {
      title: 'Admin Dashboard',
      stats,
      recentProducts: productList.slice(0, 10),
    });
  } catch (err) {
    console.error('Error loading admin dashboard:', err);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to load dashboard. Please try again later.' 
    });
  }
});

app.get('/admin/products', isAdmin, async (req, res) => {
  try {
    const [products, categories, brands] = await Promise.all([
      apiService.get('/products', req),
      apiService.get('/categories', req),
      apiService.get('/brands', req),
    ]);

    res.render('adminProducts', {
      title: 'Manage Products',
      products: Array.isArray(products) ? products : products?.products || [],
      categories: Array.isArray(categories) ? categories : categories?.categories || [],
      brands: Array.isArray(brands) ? brands : brands?.brands || [],
      message: req.query.message || null,
    });
  } catch (err) {
    console.error('Error loading admin products:', err);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to load products. Please try again later.' 
    });
  }
});

app.post('/admin/products/add', isAdmin, async (req, res) => {
  try {
    const productData = {
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      price: parseFloat(req.body.price),
      description: req.body.description,
      featured: req.body.featured === 'on',
      images: [req.body.images],
      specifications: req.body.specifications ? JSON.parse(req.body.specifications) : {},
    };

    await apiService.post('/products', productData, req);
    res.redirect('/admin/products?message=Product added successfully');
  } catch (error) {
    console.error('Error adding product:', error.response?.data || error.message);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to add product: ' + (error.response?.data?.message || error.message)
    });
  }
});

app.post('/admin/products/edit/:id', isAdmin, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      price: parseFloat(req.body.price),
      featured: req.body.featured === 'on',
      images: [req.body.images],
      specifications: req.body.specifications ? JSON.parse(req.body.specifications) : {},
    };

    await apiService.put(`/products/${req.params.id}`, productData, req);
    res.redirect('/admin/products?message=Product updated successfully');
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to update product. Please try again later.' 
    });
  }
});

app.delete('/admin/products/:id', isAdmin, async (req, res) => {
  try {
    await apiService.delete(`/products/${req.params.id}`, req);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.json({ success: false, error: error.message });
  }
});

app.get('/admin/categories', isAdmin, async (req, res) => {
  try {
    const categories = await apiService.get('/categories', req);
    const categoryList = Array.isArray(categories) ? categories : categories?.categories || [];
    
    res.render('adminCategories', {
      title: 'Manage Categories',
      categories: categoryList,
      message: req.query.message || null,
    });
  } catch (err) {
    console.error('Error loading admin categories:', err);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to load categories. Please try again later.' 
    });
  }
});

app.post('/admin/categories/add', isAdmin, async (req, res) => {
  try {
    await apiService.post('/categories', req.body, req);
    res.redirect('/admin/categories?message=Category added successfully');
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to add category. Please try again later.' 
    });
  }
});

app.post('/admin/categories/edit/:id', isAdmin, async (req, res) => {
  try {
    await apiService.put(`/categories/${req.params.id}`, req.body, req);
    res.redirect('/admin/categories?message=Category updated successfully');
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to update category. Please try again later.' 
    });
  }
});

app.delete('/admin/categories/:id', isAdmin, async (req, res) => {
  try {
    await apiService.delete(`/categories/${req.params.id}`, req);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.json({ success: false });
  }
});

app.get('/admin/brands', isAdmin, async (req, res) => {
  try {
    const brands = await apiService.get('/brands', req);
    const brandList = Array.isArray(brands) ? brands : brands?.brands || [];
    
    res.render('adminBrands', {
      title: 'Manage Brands',
      brands: brandList,
      message: req.query.message || null,
    });
  } catch (err) {
    console.error('Error loading admin brands:', err);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to load brands. Please try again later.' 
    });
  }
});

app.post('/admin/brands/add', isAdmin, async (req, res) => {
  try {
    await apiService.post('/brands', req.body, req);
    res.redirect('/admin/brands?message=Brand added successfully');
  } catch (error) {
    console.error('Error adding brand:', error.response?.data || error.message);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to add brand. Please try again later.' 
    });
  }
});

app.post('/admin/brands/edit/:id', isAdmin, async (req, res) => {
  try {
    await apiService.put(`/brands/${req.params.id}`, req.body, req);
    res.redirect('/admin/brands?message=Brand updated successfully');
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to update brand. Please try again later.' 
    });
  }
});

app.delete('/admin/brands/:id', isAdmin, async (req, res) => {
  try {
    await apiService.delete(`/brands/${req.params.id}`, req);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.json({ success: false });
  }
});

// ===== IMAGE UPLOAD ROUTE =====
app.post('/upload-product-image', isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: 'No file uploaded' });
    }

    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const token = apiService.getToken(req);
    const response = await axios.post(
      `${API_BASE_URL}/upload/product`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${token}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Upload error:', error.response?.data || error.message);
    res.json({ 
      success: false, 
      message: error.response?.data?.message || error.message 
    });
  }
});

// ===== ERROR HANDLERS =====

app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', {
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again later.',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Frontend server running on port ${PORT}`);
  console.log(`🔗 Backend API: ${API_BASE_URL}`);
  console.log(`👤 Admin: http://localhost:${PORT}/admin/login`);
  console.log(`📝 Make sure backend is running on ${API_BASE_URL}`);
});