
import {  
  Box,
  Button,
  IconButton, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add, Remove } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import agent from '../../app/api/agent';
import { Link } from 'react-router-dom';
import type { Product } from '../../app/models/product';
import BasketSummary from './BasketSummary';

export default function BasketPage() {

  // 1. Extraire l'état du panier et l'outil de dispatch depuis Redux Toolkit
  const { basket } = useAppSelector(state => state.basket);
  const dispatch = useAppDispatch();
  const {Basket: BasketActions} = agent;

  const removeItem = (productId: number) => {
    BasketActions.removeItem(productId, dispatch);
  }

  const decrementItem = (productId: number, quantity = 1) => {
    BasketActions.decrementItemQuantity(productId, quantity, dispatch);
  };

  const incrementItem = (productId: number, quantity = 1) => {
    BasketActions.incrementItemQuantity(productId, quantity, dispatch);
  };

  // 3. Utilitaires de formatage (À regrouper idéalement dans un fichier utils/formatters.ts)
  const extractImageName = (item: Product): string | null => {
    if (item && item.pictureUrl){
      const parts = item.pictureUrl.split('/');
      if (parts.length > 0) {
        return parts[parts.length - 1];
      }
    }
    return null;
  };


  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(price);
  };

  // 4. Affichage conditionnel : Panier vide
  if (!basket || basket.items.length === 0) {
    return (
      <Typography variant="h3" sx={{ mt: 4, textAlign: 'center' }}>
        Your basket is empty. Please add some products!!!
      </Typography>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto', mt: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product Image</TableCell>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="center">Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket.items.map((item) => (
              <TableRow key={item.id}>
                {/* Image du produit */}
                <TableCell>
                  {item.pictureUrl && (
                    <img 
                      src={"/images/products/" + extractImageName(item)} 
                      alt={item.name || "Product"} 
                      width="50" 
                      height="50" 
                      style={{ objectFit: 'contain', borderRadius: 4 }}
                    />
                  )}
                </TableCell>

                {/* Nom du produit avec largeur adaptative */}
                <TableCell sx={{ minWidth: 150, maxWidth: 250, wordBreak: 'break-word' }}>
                  {item.name}
                </TableCell>

                {/* Prix unitaire (Empêche la rupture de ligne pour les devises longues) */}
                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                  {formatPrice(item.price)}
                </TableCell>

                {/* Quantité : Flexbox horizontal pour aligner les boutons - [Qté] + */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => decrementItem(item.id)}
                    >
                      <Remove />
                    </IconButton>
                    
                    <Typography component="span" sx={{ mx: 1, fontWeight: 'bold', minWidth: 20, textAlign: 'center' }}>
                      {item.quantity}
                    </Typography>

                    <IconButton 
                      color="primary" 
                      size="small"
                      onClick={() => incrementItem(item.id)}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                </TableCell>

                {/* Sous-total */}
                <TableCell align="right" sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                  {formatPrice(item.price * item.quantity)}
                </TableCell>

                {/* Bouton de suppression */}
                <TableCell align="center">
                  <IconButton onClick={() => removeItem(item.id)} aria-label="delete" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
          <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 4, boxShadow: 2, border: '1px solid', borderColor: 'divider' }}>
          <BasketSummary />
          <Button
            component={Link}
            to="/checkout"
            variant="contained"
            size="large"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'none',
              bgcolor: 'primary.main',
              color: '#ffffff', 
              letterSpacing: 0.5,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Checkout
          </Button>
        </Box>
    </>
  );
}