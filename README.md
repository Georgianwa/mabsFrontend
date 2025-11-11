# ElectroStore - E-commerce Web Application

A modern, responsive e-commerce web application for electronics and home appliances, built with Node.js, Express, and EJS templating. Inspired by fouanistore.com design aesthetic.

## 🌟 Features

- **Product Showcase**: Browse electronics and appliances across multiple categories
- **Search Functionality**: Search products by name, brand, category, or description
- **Category Navigation**: Organized categories (TVs, Audio/Video, Refrigerators, Washing Machines, ACs, Kitchen Appliances)
- **Brand Showcase**: Shop by your favorite brands (LG, Samsung, Hisense, Panasonic, etc.)
- **Product Details**: Detailed product pages with specifications, images, and descriptions
- **Contact Form**: Get in touch with the store team
- **Newsletter Signup**: Subscribe to receive updates and promotions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with smooth animations

## 📁 Project Structure

```
ecommerce_store/
├── app.js                  # Express server and routes
├── package.json            # Dependencies and scripts
├── README.md              # Project documentation
├── data/
│   └── products.js        # Product data and categories
├── views/
│   ├── partials/
│   │   ├── header.ejs     # Header component
│   │   ├── navigation.ejs # Navigation menu
│   │   └── footer.ejs     # Footer component
│   ├── index.ejs          # Homepage
│   ├── categories.ejs     # All categories page
│   ├── category.ejs       # Category detail page
│   ├── product.ejs        # Product detail page
│   ├── brands.ejs         # Brands showcase page
│   ├── about.ejs          # About us page
│   ├── contact.ejs        # Contact page
│   ├── search.ejs         # Search results page
│   ├── 404.ejs           # 404 error page
│   └── 500.ejs           # 500 error page
└── public/
    ├── css/
    │   └── style.css      # Main stylesheet
    ├── js/
    │   └── main.js        # Client-side JavaScript
    └── images/            # Image assets

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd /home/ubuntu/ecommerce_store
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **For development with auto-reload**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and visit:
   ```
   http://localhost:3000
   ```

## 📄 Available Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Homepage with featured products |
| `/categories` | GET | All categories listing |
| `/category/:categoryId` | GET | Products in a specific category |
| `/product/:productId` | GET | Product detail page |
| `/brands` | GET | Shop by brand page |
| `/about` | GET | About us page |
| `/contact` | GET | Contact form page |
| `/contact` | POST | Handle contact form submission |
| `/search?q=query` | GET | Search results page |
| `/newsletter` | POST | Newsletter signup (AJAX) |

## 🎨 Design Features

### Color Scheme
- Primary: `#0066cc` (Blue)
- Secondary: `#ff6b00` (Orange)
- Dark: `#1a1a1a`
- Light Gray: `#f5f5f5`

### Responsive Breakpoints
- Desktop: 1024px and above
- Tablet: 768px - 1023px
- Mobile: 767px and below

## 📦 Dependencies

- **express**: ^4.18.2 - Web framework
- **ejs**: ^3.1.9 - Templating engine
- **body-parser**: ^1.20.2 - Request body parsing
- **express-validator**: ^7.0.1 - Form validation

## 🛠️ Customization

### Adding New Products

Edit `/data/products.js` and add new product objects to the `products` array:

```javascript
{
  id: 'unique-id',
  name: 'Product Name',
  brand: 'Brand Name',
  category: 'category-id',
  price: 999.99,
  description: 'Product description',
  specifications: {
    'Spec 1': 'Value 1',
    'Spec 2': 'Value 2'
  },
  images: ['image-url-1', 'image-url-2'],
  featured: false
}
```

### Adding New Categories

Edit `/data/products.js` and add new category objects to the `categories` array:

```javascript
{
  id: 'category-id',
  name: 'Category Name',
  description: 'Category description',
  image: 'category-image-url'
}
```

### Styling Customization

Modify `/public/css/style.css` to customize colors, fonts, and layout. CSS variables are defined at the top of the file:

```css
:root {
    --primary-color: #0066cc;
    --secondary-color: #ff6b00;
    /* ... more variables */
}
```

## 🔧 Configuration

### Port Configuration

The server runs on port 3000 by default. To change the port:

```bash
PORT=8080 npm start
```

Or modify the `PORT` constant in `app.js`.

## 📱 Features Breakdown

### Homepage
- Hero banner with call-to-action
- Promotional features (shipping, warranty, support, returns)
- Featured products grid
- Category highlights
- Brand showcase

### Product Pages
- High-quality product images with gallery
- Detailed specifications
- Price information
- Related products
- Contact for purchase option

### Search
- Real-time search across product names, descriptions, brands, and categories
- Search results with product cards
- Helpful suggestions when no results found

### Contact Form
- Form validation
- Success/error messages
- Contact information display

### Newsletter
- AJAX form submission
- Real-time feedback
- Email validation

## 🚀 Deployment

### Production Deployment

1. **Set NODE_ENV to production**:
   ```bash
   export NODE_ENV=production
   ```

2. **Use a process manager** (e.g., PM2):
   ```bash
   npm install -g pm2
   pm2 start app.js --name "electrostore"
   ```

3. **Set up reverse proxy** (e.g., Nginx) for production.

### Environment Variables

Create a `.env` file for environment-specific configurations:

```env
PORT=3000
NODE_ENV=production
```

## 🔒 Security Considerations

For production deployment:
- Add rate limiting middleware
- Implement CSRF protection
- Use HTTPS
- Sanitize user inputs
- Add security headers (helmet.js)
- Set up proper CORS policies

## 📝 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

This is a client project template. For modifications or enhancements, please contact the development team.

## 📞 Support

For questions or issues:
- Email: support@electrostore.com
- Phone: +1 (800) 123-4567

## 🎯 Future Enhancements

Potential features to add:
- User authentication and accounts
- Shopping cart functionality
- Payment integration
- Order management
- Admin dashboard
- Product reviews and ratings
- Wishlist functionality
- Live chat support
- Multi-language support
- Advanced filtering and sorting

## 📚 Technologies Used

- **Backend**: Node.js, Express.js
- **Templating**: EJS (Embedded JavaScript)
- **Styling**: CSS3 with Flexbox and Grid
- **JavaScript**: Vanilla JS (ES6+)
- **Icons**: Font Awesome 6.4.0
- **Images**: Unsplash API (placeholder images)

---

**Built with ❤️ using Node.js and Express**
