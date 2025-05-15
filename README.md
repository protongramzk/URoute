# URoute

> _This README was generated with the assistance of Claude AI (Anthropic)_

A lightweight, easy-to-use Single Page Application (SPA) routing library for JavaScript with no dependencies.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- 📦 **Lightweight**: Minimal footprint with zero dependencies
- 🌐 **Client-side Routing**: Smooth SPA navigation with History API
- 🔄 **Dynamic Routes**: Support for parameterized routes like `/users/{id}`
- 🌲 **Nested Routes**: Create hierarchical route structures
- 🚥 **Loading States**: Built-in loading indicator support
- 🚫 **404 Handling**: Custom not-found route handler
- 🧩 **Simple API**: Intuitive method chaining

## Installation

### Direct Script Include

```html
<script src="path/to/uroute.js"></script>
```

### NPM

```bash
npm install uroute
```

## Quick Start

```javascript
// Initialize the router
const router = new URoute();

// Define basic routes
router.route('/', () => {
  document.getElementById('app').innerHTML = '<h1>Home Page</h1>';
});

router.route('/about', () => {
  document.getElementById('app').innerHTML = '<h1>About Us</h1>';
});

// Route with parameters
router.route('/profile/{id}', (params) => {
  document.getElementById('app').innerHTML = `<h1>Profile ${params.id}</h1>`;
});

// Start the router
router.start();
```

## Core Concepts

### Basic Routing

Define routes using the `route()` method:

```javascript
router.route('/contact', () => {
  document.getElementById('app').innerHTML = '<h1>Contact Page</h1>';
});
```

### Route Parameters

Extract dynamic segments from URLs:

```javascript
router.route('/blog/{category}/{postId}', (params) => {
  const { category, postId } = params;
  document.getElementById('app').innerHTML = `
    <h1>${category} Post #${postId}</h1>
  `;
});
```

### Nested Routes

Create hierarchical routes with the `child()` method:

```javascript
router.route('/admin', () => {
  document.getElementById('app').innerHTML = `
    <h1>Admin Dashboard</h1>
    <div id="admin-content"></div>
  `;
})
.child('/admin/users', () => {
  document.getElementById('admin-content').innerHTML = '<h2>User Management</h2>';
})
.child('/admin/settings', () => {
  document.getElementById('admin-content').innerHTML = '<h2>System Settings</h2>';
});
```

### 404 Handling

Handle routes that don't match any defined patterns:

```javascript
router.notFound(() => {
  document.getElementById('app').innerHTML = `
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
  `;
});
```

### Loading State

Manage loading indicators during route transitions:

```javascript
router.whenLoading((isLoading) => {
  const loader = document.getElementById('loader');
  loader.style.display = isLoading ? 'block' : 'none';
});
```

### Programmatic Navigation

Navigate between routes using code:

```javascript
document.getElementById('login-button').addEventListener('click', () => {
  // Login logic here...
  router.navigate('/dashboard');
});
```

## API Reference

### Constructor

#### `new URoute()`

Creates a new router instance.

### Methods

#### `route(path, callback, options)`

Defines a new route with the specified path and callback.

- `path` (String): URL path pattern
- `callback` (Function): Handler function that receives route parameters
- `options` (Object, optional): Additional options for the route

Returns an object with child route methods for chaining.

#### `start()`

Initializes the router and triggers the route matching for the current URL.

Returns the router instance for chaining.

#### `navigate(path)`

Navigates to the specified path programmatically.

- `path` (String): The path to navigate to

Returns the router instance for chaining.

#### `notFound(callback)`

Sets a handler function for routes that don't match any defined patterns (404).

- `callback` (Function): Handler function for "not found" routes

Returns the router instance for chaining.

#### `whenLoading(callback)`

Sets a handler function for loading states during route transitions.

- `callback` (Function): Handler function that receives a boolean indicating loading state

Returns the router instance for chaining.

## How It Works

URoute works by:

1. Intercepting URL changes (clicks on links or browser navigation)
2. Preventing default browser behavior that would request a new page
3. Using the History API to update the URL without a page reload
4. Matching the current URL against defined route patterns
5. Extracting parameters from dynamic segments
6. Executing the corresponding route callback

This provides a smooth, SPA-like navigation experience without requiring a full page reload.

## Browser Support

URoute relies on the HTML5 History API, which is supported in all modern browsers:

- Chrome 5+
- Firefox 4+
- Safari 5+
- Opera 11.5+
- IE 10+
- Edge (all versions)

## License

MIT © [Your Name]
