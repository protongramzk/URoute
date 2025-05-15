/**
 * URoute - Simple SPA Routing Library
 * Memungkinkan routing client-side dengan API yang sederhana
 */
class URoute {
  constructor() {
    this.routes = [];
    this.currentPath = window.location.pathname;
    this.notFoundHandler = null;
    this.loadingHandler = null;
    this.isLoading = false;
    
    // Inisialisasi event listener untuk perubahan URL
    this._initEventListeners();
  }

  /**
   * Menambahkan route dan callback yang terkait
   * @param {string} path - Path untuk route (bisa berisi parameter dalam format {namaParam})
   * @param {function} callback - Fungsi yang dipanggil ketika route cocok
   * @param {object} options - Opsi tambahan untuk route
   * @returns {URoute} - Instance router untuk chaining
   */
  route(path, callback, options = {}) {
    // Konversi path menjadi regex untuk mencocokkan parameter dinamis
    const regexPath = path.replace(/{([^/]+)}/g, '([^/]+)');
    const paramNames = (path.match(/{([^/]+)}/g) || [])
      .map(param => param.replace(/{|}/g, ''));
      
    const routeObj = {
      path,
      regex: new RegExp(`^${regexPath}$`),
      paramNames,
      callback,
      options,
      children: []
    };
    
    this.routes.push(routeObj);
    
    // Cek route saat ini jika cocok dengan route yang baru ditambahkan
    this._checkRoute();
    
    // Mengembalikan objek dengan metode child untuk nested routes
    const routeChain = {
      child: (childPath, childCallback, childOptions = {}) => {
        // Pastikan path anak dimulai dengan path induk
        if (!childPath.startsWith(path)) {
          if (path.endsWith('/')) {
            childPath = path + childPath.substring(1);
          } else {
            childPath = path + childPath;
          }
        }
        
        // Buat route anak
        const childRouteObj = this.route(childPath, childCallback, childOptions);
        routeObj.children.push(childRouteObj);
        
        return routeChain;
      },
      // Metode lain yang dapat di-chaining
      getRouter: () => this
    };
    
    return routeChain;
  }

  /**
   * Navigasi ke path tertentu
   * @param {string} path - Path tujuan
   */
  navigate(path) {
    // Push state baru ke history API
    window.history.pushState(null, null, path);
    
    // Update path saat ini
    this.currentPath = path;
    
    // Jalankan routing
    this._checkRoute();
    
    return this;
  }

  /**
   * Inisialisasi event listener untuk navigasi browser
   * @private
   */
  _initEventListeners() {
    // Handle tombol back/forward browser
    window.addEventListener('popstate', () => {
      this.currentPath = window.location.pathname;
      this._checkRoute();
    });

    // Tangkap klik pada link dan alihkan ke router
    document.addEventListener('click', (e) => {
      // Cek apakah yang diklik adalah link
      const link = e.target.closest('a');
      if (!link) return;
      
      // Tangkap hanya link internal (sama domain)
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('#')) return;
      
      // Cegah perilaku default
      e.preventDefault();
      
      // Navigasi menggunakan router
      this.navigate(href);
    });
  }

  /**
   * Memeriksa route yang cocok dengan path saat ini
   * @private
   */
  _checkRoute() {
    const path = this.currentPath;
    
    // Mulai loading
    this._startLoading();
    
    // Cari route yang cocok
    for (const route of this.routes) {
      const match = path.match(route.regex);
      
      if (match) {
        // Ekstrak parameter dari URL
        const params = {};
        if (route.paramNames.length > 0 && match.length > 1) {
          match.slice(1).forEach((value, index) => {
            params[route.paramNames[index]] = value;
          });
        }
        
        // Panggil callback dengan parameter
        setTimeout(() => {
          route.callback(params);
          this._endLoading();
        }, 0);
        return;
      }
    }
    
    // Jika tidak ada route yang cocok, panggil notFoundHandler
    if (this.notFoundHandler) {
      setTimeout(() => {
        this.notFoundHandler();
        this._endLoading();
      }, 0);
    } else {
      // Jika tidak ada notFoundHandler
      console.warn(`No route found for path: ${path}`);
      this._endLoading();
    }
  }
  
  /**
   * Memulai state loading
   * @private
   */
  _startLoading() {
    this.isLoading = true;
    if (this.loadingHandler) {
      this.loadingHandler(true);
    }
  }
  
  /**
   * Mengakhiri state loading
   * @private
   */
  _endLoading() {
    this.isLoading = false;
    if (this.loadingHandler) {
      this.loadingHandler(false);
    }
  }

  /**
   * Start the router
   * @returns {URoute} - Instance dari router untuk chaining
   */
  start() {
    // Periksa route awal saat aplikasi dimuat
    this._checkRoute();
    return this;
  }
  
  /**
   * Mendefinisikan handler untuk route yang tidak ditemukan (404)
   * @param {function} callback - Fungsi yang dipanggil ketika tidak ada route yang cocok
   * @returns {URoute} - Instance dari router untuk chaining
   */
  notFound(callback) {
    this.notFoundHandler = callback;
    return this;
  }
  
  /**
   * Mendefinisikan handler untuk status loading
   * @param {function} callback - Fungsi yang dipanggil dengan parameter boolean (true saat loading mulai, false saat selesai)
   * @returns {URoute} - Instance dari router untuk chaining
   */
  whenLoading(callback) {
    this.loadingHandler = callback;
    return this;
  }
}

// Contoh penggunaan:
// const router = new URoute();
//
// // Route sederhana
// router.route('/', () => {
//   console.log('Home page');
//   document.getElementById('app').innerHTML = '<h1>Home</h1>';
// });
//
// // Route dengan parameter
// router.route('/profile/{id}', (params) => {
//   console.log(`Profile page for user ${params.id}`);
//   document.getElementById('app').innerHTML = `<h1>Profile ${params.id}</h1>`;
// });
//
// // Child routes
// router.route('/users', () => {
//   document.getElementById('app').innerHTML = '<h1>Users</h1><div id="user-content"></div>';
// })
// .child('/users/{id}', (params) => {
//   document.getElementById('user-content').innerHTML = `<h2>User Detail: ${params.id}</h2>`;
// })
// .child('/users/{id}/edit', (params) => {
//   document.getElementById('user-content').innerHTML = `<h2>Edit User: ${params.id}</h2>`;
// });
//
// // Not found handler
// router.notFound(() => {
//   document.getElementById('app').innerHTML = '<h1>404 - Page Not Found</h1>';
// });
//
// // Loading indicator
// router.whenLoading((isLoading) => {
//   const loader = document.getElementById('loader');
//   if (isLoading) {
//     loader.style.display = 'block';
//   } else {
//     loader.style.display = 'none';
//   }
// });
//
// router.start();
