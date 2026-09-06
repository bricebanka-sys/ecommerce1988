import { useState, useEffect } from 'react';
import { Typography, Grid, Table, TableBody, TableRow, TableCell, TableContainer, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import type { Product } from '../../app/models/product';
import agent from '../../app/api/agent';
import NotFound from '../../app/errors/NotFoundError';
import Spinner from '../../app/layout/Spinner';


export default function ProductDetails() {

  // Récupération du paramètre d'URL (ex: /products/:id)
  const { id } = useParams<{ id:string }>();

  // Gestion des états
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  useEffect(() => {
    if (id) {
    agent.Store.details(parseInt(id))
      .then(response => setProduct(response))
      .catch(error => console.error("Error retrieving the product: ", error))
      .finally(() => setLoading(false));
  }
  }, [id])

  // 1. Affichage pendant le chargement
if (loading) {
  return <Spinner message="Loading product..." />;
}

// 2. Affichage si le produit est introuvable
if (!product) {
  return <NotFound />;
}
  return (
    <Grid container spacing={6}>
      <Grid size={6}>
        <img src={"/images/products/"+extractImageName(product)} alt={product.name} style={{width: '100%'}}/>
      </Grid>
      <Grid size={6}>
        <Typography variant='h3'>{product.name}</Typography>
        <Divider sx={{mb: 2}}/>
        <Typography gutterBottom color='secondary' variant='h4'>{formatPrice(product.price)}</Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.productType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.productBrand}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}