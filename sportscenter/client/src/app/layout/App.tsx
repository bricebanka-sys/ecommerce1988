
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Header from './Header';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useAppDispatch } from '../store/configureStore';
import { getBasketFromLocalStorage } from '../util/util';
import agent from '../api/agent';
import { fetchCurrentUser } from '../../features/account/accountSlice';
import { setBasket } from '../../features/basket/basketSlice';
import Spinner from './Spinner';
function App() {

  // État local pour le mode sombre
  const [darkMode, setDarkMode] = useState(false);
  // Configuration du type de palette (light ou dark)
  const paletteType = darkMode ? 'dark' : 'light';
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function initializeApp() {
      // 2. Vérification de l'existence d'un panier en local
      const basket = getBasketFromLocalStorage();
      dispatch(fetchCurrentUser());

      if (basket) {
        try {
          const response = await agent.Basket.get();
          dispatch(setBasket(response));
        } catch (error) {
          console.log('Error fetching basket:', error);
        } finally {
          setLoading(false);
        }
      } else {        
        setLoading(false);
      }
    }

    initializeApp();
  }, [dispatch]);


  // Instanciation du thème Material UI personnalisé
  const theme = createTheme({
    palette: {
      mode: paletteType,
    },
  });

  // Fonction de bascule de l'état (Toggle)
  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  // Affichage de l'indicateur de chargement pendant l'initialisation
    if (loading) return <Spinner message="Getting Basket..." />;
  return (
    <ThemeProvider theme={theme}>
      {/*  Provider MUI injectant le thème dynamique à toute l'application */}
        {/* Configuration globale du conteneur de notifications */}
        <ToastContainer 
          position="bottom-right" 
          hideProgressBar 
          theme="colored" 
        />
        {/*  Normalise les styles CSS à travers tous les navigateurs */}
        <CssBaseline />
        
        {/*  Barre de navigation supérieure */}
        <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
        
        {/*  Conteneur principal centré avec des marges latérales automatiques */}
        <Container sx={{ paddingTop: "64px" }}>
          {/* Outlet effectue le rendu dynamique des routes enfants */}
          <Outlet />
        </Container>
    </ThemeProvider>
    
  )
}

export default App
