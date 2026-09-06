
import { ShoppingCart } from '@mui/icons-material';
import { AppBar, Box, IconButton, Badge, List, ListItem, Switch, Toolbar, Typography } from '@mui/material';
import { NavLink, Link } from 'react-router-dom';
import { useAppSelector } from '../store/configureStore';
import { useEffect } from 'react';
import SignedInMenu from './SignedInMenu';


// Données des liens de navigation principaux
const navLinks = [
  { title: 'Home', path: '/' },
  { title: 'Store', path: '/store' },
  { title: 'Contact', path: '/contact' },
];

// Liens d'authentification et de compte
const accountLinks = [
  { title: 'Login', path: '/login' },
  { title: 'Register', path: '/register' }
];

// Objet de style personnalisés et reutilisable pour la prop sx de MUI
const navStyles = {
  color: 'inherit',
  textDecoration: 'none',
  typography: 'h6',
  '&:hover': {
    color: 'secondary.main',
  },
  '&.active': {
    color: 'text.secondary',
  },
};

// Interface décrivant les propriétés reçues par le Header
interface Props {
  darkMode: boolean;
  handleThemeChange: () => void;
}

export default function Header({ darkMode, handleThemeChange }: Props) {

  // 1. Extraction de l'utilisateur depuis le state Redux
  const { user } = useAppSelector((state) => state.account);

  // Récupération de l'état du panier dans le Store Redux
  const { basket } = useAppSelector(state => state.basket);
  console.log('Basket in Header:', basket);


  useEffect(() => {
    // Journal de débogage pour vérifier le contenu des articles du panier
    if (basket) {
      console.log('Items in Basket:', basket.items);
    }
  }, [basket]); // Dépendance stricte sur l'objet basket

  // Calcul de la somme totale des quantités d'articles
  const itemCount = basket?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (

    // position="fixed" maintient la barre en haut lors du défilement
    // zIndex s'assure que le Header reste toujours au-dessus des autres composants
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} >
      {/* Alignement principal avec Flexbox */}
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6">
              Sports Center
            </Typography>
          {/* Composant Switch contrôlé par l'état du parent */}
          <Switch checked={darkMode} onChange={handleThemeChange} />
        </Box>

        {/* Section centrale : Liste des liens de navigation principaux */}
        <List sx={{ display: 'flex' }}>
          {navLinks.map(({ title, path }) => (
            <ListItem
              key={path}
              component={NavLink}
              to={path}
              sx={navStyles}
            >
              {title}
            </ListItem>
          ))}
        </List>

        {/* Section de droite : Panier d'achat & Liens Utilisateur */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          
            {/* Bouton Icône avec Badge de Panier */}
            <IconButton component={Link} to="/basket" size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
              <Badge badgeContent={itemCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {user ? (
            <SignedInMenu />): (        
            <List sx={{ display: 'flex' }}>
              {accountLinks.map(({ title, path }) => (
                <ListItem
                  key={path}
                  component={NavLink}
                  to={path}
                  sx={navStyles}
                >
                  {title}
                </ListItem>
              ))}
            </List>
         )}    
        </Box>
      </Toolbar>
    </AppBar>
  );
}