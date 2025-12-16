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
import MongoStore from 'connect-mongo';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 6000;
const API_BASE_URL = process.env.API_BASE_URL;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

const cache = {
  data: {},
  timestamps: {},
  TTL: 5 * 60 * 1000, // 5 minutes
  
  get(key) {
    const now = Date.now();
    if (this.data[key] && (now - this.timestamps[key]) < this.TTL) {
      console.log(`📦 Cache hit: ${key}`);
      return this.data[key];
    }
    return null;
  },
  
  set(key, value) {
    this.data[key] = value;
    this.timestamps[key] = Date.now();
  }
};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 24 * 60 * 60
    }),
    cookie: { 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
    },
    name: 'sessionId',
    rolling: true,
    proxy: true
  })
);

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Auth middleware
function isAdmin(req, res, next) {
  if (req.session.isAdmin && req.session.adminToken) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

// ===== API SERVICE =====
const apiService = {
  getToken(req) {
    return req.session.adminToken || null;
  },

  async get(endpoint, req, headers = {}) {
    try {
      const cacheKey = endpoint;
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      await delay(100);

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
      cache.set(cacheKey, res.data)

      return res.data;
    } catch (err) {
      
       if (err.response?.status === 429) {
        console.error(`⚠️ Rate limited on ${endpoint}, retrying in 2s...`);
        await delay(2000);
        return this.get(endpoint, req, headers); // Retry once
      }

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

// Helper to get categories and brands for navigation
async function getNavData(req) {
  try {
    const [categoriesRes, brandsRes] = await Promise.all([
      apiService.get('/categories', req),
      apiService.get('/brands', req),
    ]);

    const categories = (Array.isArray(categoriesRes) ? categoriesRes : categoriesRes?.categories || [])
      .map(cat => ({
        id: cat._id || cat.id,
        name: cat.title || cat.name
      }));
    
    const brands = (Array.isArray(brandsRes) ? brandsRes : brandsRes?.brands || [])
      .map(brand => ({
        id: brand._id || brand.id,
        name: brand.name
      }));

    return { categories, brands };
  } catch (error) {
    console.error('Error getting nav data:', error);
    return { categories: [], brands: [] };
  }
}

// ===== HELPER =====
const getFeaturedProducts = (products) =>
  Array.isArray(products) ? products.filter((p) => p.featured).slice(0, 6) : [];

// ===== PUBLIC ROUTES =====

// Home
app.get('/', async (req, res) => {
  try {
    const [productsRes, categoriesRes, brandsRes] = await Promise.all([
      apiService.get('/products', req),
      apiService.get('/categories', req),
      apiService.get('/brands', req),
    ]);

    console.log('Home - Products response:', productsRes);
    console.log('Home - Categories response:', categoriesRes);
    console.log('Home - Brands response:', brandsRes);

    // Handle different response structures
    const productList = Array.isArray(productsRes) 
      ? productsRes 
      : (productsRes?.products || []);
    
    const categoryList = Array.isArray(categoriesRes) 
      ? categoriesRes 
      : (categoriesRes?.categories || []);
    
    const brandList = Array.isArray(brandsRes) 
      ? brandsRes 
      : (brandsRes?.brands || []);

    const featuredProducts = getFeaturedProducts(productList);

    res.render('index', {
      title: 'Home - Mabs Electronics',
      categories: categoryList,
      featuredProducts,
      brands: brandList.slice(0, 6),
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
    const navData = await getNavData(req);

    const isAdmin = req.user && req.user.role === 'admin';

    const productsRes = await apiService.get('/products?limit=25&page=1', req);
    const productList = Array.isArray(productsRes) ? productsRes : (productsRes?.products || []);
    
    res.render('products', {
      title: 'All Products',
      products: productList,
      isAdmin,
      ...navData
    });
  } catch (err) {
    console.error('Error loading products:', err);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to load products. Please try again later.' 
    });
  }
});

app.get('/product/:id', async (req, res) => {
  try {
    const navData = await getNavData(req);
    const product = await apiService.get(`/products/${req.params.id}`, req);
    
    if (!product) {
      return res.status(404).render('404', { 
        title: 'Not Found', 
        message: 'Product not found.',
        ...navData
      });
    }

    const relatedProductsRes = await apiService.get(`/products?category=${product.category._id || product.category}`, req);
    const relatedProducts = (Array.isArray(relatedProductsRes) ? relatedProductsRes : relatedProductsRes?.products || [])
      .filter(p => p._id !== product._id)
      .slice(0, 4);

    res.render('product', { 
      title: product.name, 
      product,
      relatedProducts,
      phoneNumber: process.env.PHONE_NUMBER,
      ...navData,

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
    const navData = await getNavData(req);
    const categoriesRes = await apiService.get('/categories', req);
    const categoryList = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes?.categories || []);
    
    res.render('categories', {
      title: 'Categories',
      categories: categoryList,
      ...navData
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
    const navData = await getNavData(req);
    const category = await apiService.get(`/categories/${req.params.id}`, req);
    
    if (!category) {
      return res.status(404).render('404', { 
        title: 'Not Found', 
        message: 'Category not found.',
        ...navData
      });
    }

    const productsRes = await apiService.get(`/products?category=${req.params.id}`, req);
    const productList = Array.isArray(productsRes) ? productsRes : (productsRes?.products || []);

    res.render('category', {
      title: `${category.title} - Products`,
      category,
      products: productList,
      ...navData
    });
  } catch (err) {
    console.error('Error loading category:', err);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to load category. Please try again later.' 
    });
  }
});

// ADD THIS TO YOUR app.js AFTER THE CATEGORIES ROUTE (around line 350)

// Brands page - All brands
app.get('/brands', async (req, res) => {
  try {
    const navData = await getNavData(req);
    const brandsRes = await apiService.get('/brands', req);
    const brandList = Array.isArray(brandsRes) ? brandsRes : (brandsRes?.brands || []);
    
    res.render('brands', {
      title: 'Shop by Brand',
      brands: brandList,
      ...navData
    });
  } catch (err) {
    console.error('Error loading brands:', err);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to load brands. Please try again later.' 
    });
  }
});

// Single brand page
app.get('/brand/:id', async (req, res) => {
  try {
    const navData = await getNavData(req);
    const brand = await apiService.get(`/brands/${req.params.id}`, req);
    
    if (!brand) {
      return res.status(404).render('404', { 
        title: 'Not Found', 
        message: 'Brand not found.',
        ...navData
      });
    }

    const productsRes = await apiService.get(`/products?brand=${req.params.id}`, req);
    const productList = Array.isArray(productsRes) ? productsRes : (productsRes?.products || []);

    res.render('brand', {
      title: `${brand.name} - Products`,
      brand,
      products: productList,
      ...navData
    });
  } catch (err) {
    console.error('Error loading brand:', err);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to load brand. Please try again later.' 
    });
  }
});

// About, Cart, Search, Contact
app.get('/about', async (req, res) => {
  const navData = await getNavData(req);
  res.render('about', { title: 'About Us', ...navData });
});

app.get('/cart', async (req, res) => {
  const navData = await getNavData(req);
  res.render('cart', { 
    title: 'My Cart',
    phoneNumber: process.env.PHONE_NUMBER,
    ...navData
  });
});

app.get('/search', async (req, res) => {
  const q = req.query.q || '';
  try {
    const navData = await getNavData(req);
    const resultsRes = await apiService.get(`/products?search=${encodeURIComponent(q)}`, req);
    const searchResults = Array.isArray(resultsRes) ? resultsRes : (resultsRes?.products || []);
    
    res.render('search', {
      title: `Search results for "${q}"`,
      products: searchResults,
      query: q,
      results: searchResults,
      ...navData
    });
  } catch (err) {
    console.error('Error searching:', err);
    res.status(500).render('500', { 
      title: 'Error', 
      message: 'Unable to perform search. Please try again later.' 
    });
  }
});

app.get('/contact', async (req, res) => {
  const navData = await getNavData(req);
  res.render('contact', {
    title: 'Contact Us',
    success: null,
    error: null,
    errors: [],
    ...navData
  });
});

app.post(
  '/contact',
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message cannot be empty'),
  async (req, res) => {
    const navData = await getNavData(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('contact', {
        title: 'Contact Us',
        success: null,
        error: null,
        errors: errors.array(),
        ...navData
      });
    }

    try {
      await apiService.post('/contact', req.body, req);
      res.render('contact', {
        title: 'Contact Us',
        success: 'Thank you for contacting us! We\'ll get back to you soon.',
        error: null,
        errors: [],
        ...navData
      });
    } catch (error) {
      console.error('Contact form error:', error.message);
      res.render('contact', {
        title: 'Contact Us',
        success: null,
        error: 'Something went wrong. Please try again later.',
        errors: [],
        ...navData
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

      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            reject(err);
          } else {
            console.log(`✅ Session saved for ${username}`);
            resolve();
          }
        });
      });
      
      res.redirect('/admin/dashboard');
      
    } catch (err) {
      console.error('❌ Admin login error:', err.response?.data || err.message);
      res.render('adminLogin', {
        title: 'Admin Login',
        error: err.response?.data?.message || 'Invalid username or password.',
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
    const [productsRes, categoriesRes, brandsRes] = await Promise.all([
      apiService.get('/products', req),
      apiService.get('/categories', req),
      apiService.get('/brands', req),
    ]);

    const productList = Array.isArray(productsRes) ? productsRes : productsRes?.products || [];
    const categoryList = Array.isArray(categoriesRes) ? categoriesRes : categoriesRes?.categories || [];
    const brandList = Array.isArray(brandsRes) ? brandsRes : brandsRes?.brands || [];

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
    const [productsRes, categoriesRes, brandsRes] = await Promise.all([
      apiService.get('/products', req),
      apiService.get('/categories', req),
      apiService.get('/brands', req),
    ]);

    res.render('adminProducts', {
      title: 'Manage Products',
      products: Array.isArray(productsRes) ? productsRes : productsRes?.products || [],
      categories: Array.isArray(categoriesRes) ? categoriesRes : categoriesRes?.categories || [],
      brands: Array.isArray(brandsRes) ? brandsRes : brandsRes?.brands || [],
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

// CORRECTED ADMIN PRODUCT ROUTES - Replace lines 520-600 in your app.js

app.post('/admin/products/add', isAdmin, async (req, res) => {
  try {
    console.log('📝 Frontend: Adding product...');
    console.log('Request body:', req.body);
    
    // Parse the images - handle both string and array
    let imagesArray = [];
    if (req.body.images) {
      if (Array.isArray(req.body.images)) {
        imagesArray = req.body.images;
      } else if (typeof req.body.images === 'string') {
        imagesArray = [req.body.images];
      }
    }
    
    const productData = {
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      price: parseFloat(req.body.price),
      description: req.body.description,
      featured: req.body.featured === 'on' || req.body.featured === 'true' || req.body.featured === true,
      images: imagesArray
    };
    
    // Add optional productId if provided
    if (req.body.productId && req.body.productId.trim()) {
      productData.productId = req.body.productId.trim();
    }

    console.log('Sending to backend:', productData);
    
    const result = await apiService.post('/products', productData, req);
    
    console.log('✅ Product added:', result);
    
    res.json({ 
      success: true, 
      message: 'Product added successfully',
      data: result
    });
    
  } catch (error) {
    console.error('❌ Error adding product:', error.response?.data || error.message);
    
    res.status(500).json({ 
      success: false,
      message: error.response?.data?.message || error.message || 'Unable to add product'
    });
  }
});

app.post('/admin/products/edit/:id', isAdmin, async (req, res) => {
  try {
    console.log('📝 Frontend: Editing product...');
    console.log('Request body:', req.body);
    
    // Parse the images - handle both string and array
    let imagesArray = [];
    if (req.body.images) {
      if (Array.isArray(req.body.images)) {
        imagesArray = req.body.images;
      } else if (typeof req.body.images === 'string') {
        imagesArray = [req.body.images];
      }
    }
    
    const productData = {
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      price: parseFloat(req.body.price),
      description: req.body.description,
      featured: req.body.featured === 'on' || req.body.featured === 'true' || req.body.featured === true,
      images: imagesArray
    };
    
    // Add optional productId if provided
    if (req.body.productId && req.body.productId.trim()) {
      productData.productId = req.body.productId.trim();
    }

    console.log('Sending to backend:', productData);
    
    const result = await apiService.put(`/products/${req.params.id}`, productData, req);
    
    console.log('✅ Product updated:', result);
    
    res.json({ 
      success: true, 
      message: 'Product updated successfully',
      data: result
    });
    
  } catch (error) {
    console.error('❌ Error updating product:', error.response?.data || error.message);
    
    res.status(500).json({ 
      success: false,
      message: error.response?.data?.message || error.message || 'Unable to update product'
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
    const categoriesRes = await apiService.get('/categories', req);
    const categoryList = Array.isArray(categoriesRes) ? categoriesRes : categoriesRes?.categories || [];
    
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
    const brandsRes = await apiService.get('/brands', req);
    const brandList = Array.isArray(brandsRes) ? brandsRes : brandsRes?.brands || [];
    
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

// ===== IMAGE UPLOAD ROUTES =====

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

app.post('/upload-category-image', isAdmin, upload.single('image'), async (req, res) => {
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
      `${API_BASE_URL}/upload/category`,
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

app.post('/upload-brand-image', isAdmin, upload.single('image'), async (req, res) => {
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
      `${API_BASE_URL}/upload/brand`,
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

app.get('/debug-images', async (req, res) => {
  try {
    const [categoriesRes, brandsRes] = await Promise.all([
      apiService.get('/categories', req),
      apiService.get('/brands', req),
    ]);
    
    res.render('debug-images', {
      categories: Array.isArray(categoriesRes) ? categoriesRes : categoriesRes?.categories || [],
      brands: Array.isArray(brandsRes) ? brandsRes : brandsRes?.brands || []
    });
  } catch (error) {
    res.send('Error: ' + error.message);
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