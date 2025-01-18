class Router {
    constructor() {
        this.routes = {
            'login': this.loginRoute,
            'facturas': this.requireAuth,
            '': this.checkAuth
        };

        // Interceptar clicks en enlaces para usar History API
        document.addEventListener('click', (e) => {
            if (e.target.matches('a')) {
                e.preventDefault();
                const path = e.target.getAttribute('href').replace('.html', '');
                this.navigateTo(path, true);
            }
        });

        window.addEventListener('popstate', () => this.handleRoute());
        window.addEventListener('load', () => {
            // Al cargar, reemplazar .html en la URL si existe
            const currentPath = window.location.pathname;
            if (currentPath.endsWith('.html')) {
                const cleanPath = currentPath.replace('.html', '');
                window.history.replaceState({}, '', cleanPath);
            }
            this.handleRoute();
        });
    }

    getRelativePath() {
        const path = window.location.pathname;
        const lastSegment = path.split('/').pop();
        return lastSegment || '';
    }

    checkAuth() {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            this.navigateTo('login');
        } else {
            this.navigateTo('facturas');
        }
    }

    loginRoute() {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            this.navigateTo('facturas');
        }
    }

    requireAuth() {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            this.navigateTo('login');
        }
    }

    handleRoute() {
        const currentPath = this.getRelativePath();
        const route = this.routes[currentPath];
        
        if (route) {
            route.call(this);
        }
    }

    navigateTo(path, pushState = false) {
        // Ruta limpia para la URL
        const cleanPath = path.replace('.html', '');
        
        // Si ya estamos en esa ruta, no hacemos nada
        if (window.location.pathname.endsWith(cleanPath)) return;

        // Actualizar el historial antes de navegar
        if (pushState) {
            window.history.pushState({}, '', cleanPath);
        } else {
            window.history.replaceState({}, '', cleanPath);
        }

        // Navegar al archivo .html real
        window.location.href = `./${path}.html`;
    }
}

export const router = new Router();