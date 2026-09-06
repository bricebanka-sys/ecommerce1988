
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../layout/App';
import ContactPage from '../../features/contact/ContactPage';
import HomePage from '../../features/home/HomePage';
import Catalog from '../../features/catalog/Catalog';
import ProductDetails from '../../features/catalog/ProductDetails';
import NotFound from '../errors/NotFoundError';
import ServerError from '../errors/ServerError';
import BasketPage from '../../features/basket/BasketPage';
import RegisterPage from '../../features/account/RegisterPage';
import SignInPage from '../../features/account/SignInPage';
import CheckoutPage from '../../features/checkout/CheckoutPage';
import RequireAuth from './RequireAuth';
import Orders from '../../features/orders/Orders';


// Création du routeur avec un tableau d'objets de configuration de routes
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // Composant racine (Shell de l'application)
    children: [

      // --- ROUTES PRIVÉES (Sécurisées par RequireAuth) ---
      {
        element: <RequireAuth />,
        children: [
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'orders', element: <Orders /> },
          // Les futures routes sécurisées (ex: /orders) seront ajoutées ici
        ],
      },

      { path: '', element: <HomePage /> },           // Route par défaut : /
      { path: 'store', element: <Catalog /> },     // Route du catalogue : /catalog
      { path: 'contact', element: <ContactPage /> }, // Route de contact : /contact
      { path: 'basket', element: <BasketPage /> },

      // Routes d'authentification --> Routes Publiques
      { path: 'login', element: <SignInPage /> },
      { path: 'register', element: <RegisterPage /> },
            
      // Exemple pour de futures fonctionnalités (ex. Détails d'un produit)
      { path: 'store/:id', element: <ProductDetails /> },
      // Routes d'erreur explicites utilisées par l'intercepteur Axios
      { path: 'not-found', element: <NotFound /> },
      { path: 'server-error', element: <ServerError /> },

      // Route Wildcard : Redirige toutes les URL non reconnues vers la route /not-found
      { path: '*', element: <Navigate replace to="/not-found" /> }
    ],
  },
]);