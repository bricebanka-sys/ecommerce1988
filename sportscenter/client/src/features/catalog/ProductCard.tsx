import { 
  Avatar, 
  Button, 
  Card, 
  CardActions, 
  CardContent, 
  CardHeader, 
  CardMedia, 
  CircularProgress, 
  Typography 
} from '@mui/material';

import type { Product } from '../../app/models/product';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../app/store/configureStore';
import { useState } from 'react';
import agent from '../../app/api/agent';
import { setBasket } from '../basket/basketSlice';
import { LoadingButton } from '@mui/lab';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {

  // Extraire le nom de l'image ou retourner null si l'URL est invalide
  const extractImageName = (item: Product): string | null => {
    if (!item || !item.pictureUrl) return null;
    
    const parts = item.pictureUrl.split('/');
    return parts.length > 0 ? parts[parts.length - 1] : null;
  };

  // Formater un nombre en devise monétaire avec 2 décimales
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  };

  // 1. État local de chargement et Hook de dispatch Redux
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  function addItem() {
    setLoading(true);
    agent.Basket.addItem(product, dispatch)
      .then(response => {
        console.log('New Basket :', response.basket);
        // Informer le Store Redux du changement d'état
        if (response?.basket) {
          dispatch(setBasket(response.basket));
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Card 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        height: '100%',
        boxShadow: 2,
        transition: '0.3s',
        '&:hover': {
          boxShadow: 6,
        }
      }}
    >
      {/* En-tête avec Avatar et Titre ajusté en bleu et plus petit */}
      <CardHeader 
        avatar={
          <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
            {product.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={product.name}
        titleTypographyProps={{
          sx: { 
            fontWeight: 'bold', 
            color: '#1976d2', // Couleur bleue professionnelle (ou primary.main)
            fontSize: '0.95rem', // Taille de police réduite
            lineHeight: 1.2
          }
        }}
      />

      {/* Image du produit responsive */}    
      <CardMedia
        sx={{ 
          height: { xs: 120, sm: 140, md: 160 }, 
          backgroundSize: 'contain',
          objectFit: 'contain',
          p: 1
        }}
        image={"/images/products/" + extractImageName(product)}
        title={product.name}
      />

      {/* Contenu : Prix, Marque et Description */}
      <CardContent sx={{ flexGrow: 1, py: 1 }}>
        <Typography gutterBottom color='secondary' variant="h6" sx={{ fontWeight: 'bold' }}>
          {formatPrice(product.price)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.productBrand} / {product.productType}
        </Typography>
      </CardContent>

      {/* Boutons d'Action */}
      <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
        <LoadingButton
          loading={loading}
          onClick={addItem}
          size="small"
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ textTransform: 'none', fontSize: '0.75rem' }}
        >
          Add to cart
        </LoadingButton>
        <Button 
          component={Link} 
          to={`/store/${product.id}`} 
          size="small"
          variant="outlined"
          sx={{ textTransform: 'none', fontSize: '0.75rem' }}
        >
          View
        </Button>
      </CardActions>
    </Card>
  );
}