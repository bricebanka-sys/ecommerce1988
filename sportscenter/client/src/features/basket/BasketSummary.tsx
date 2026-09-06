import { Box, Typography, TableContainer, Paper, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { useAppSelector } from '../../app/store/configureStore';

export default function BasketSummary() {

      // Extraction de l'état du panier via Redux
      const { basket } = useAppSelector((state) => state.basket);

      // Calcul du sous-total avec valeur par défaut si le panier est vide
      const subtotal = basket?.items.reduce(
      (sum, item) => sum + item.quantity * item.price, 
      0) ?? 0;

      // Calcul ou définition des frais de livraison
      const shipping = 200; // Montant fixe ou calculé selon des règles métiers

    // Function to format the price with EUR currency symbol
      const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 2
        }).format(price);
      };

      return (

        <Box sx={{
        mt: 4,
        p: 2,
        bgcolor: 'background.default',
        borderRadius: 2,
        boxShadow: 3,}}
        >
          <Typography variant="h5" gutterBottom>
            Basket Summary
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Subtotal</TableCell>
                  <TableCell align="right">{formatPrice(subtotal)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Shipping</TableCell>
                  <TableCell align="right">{formatPrice(shipping)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Total</strong></TableCell>
                  <TableCell align="right"><strong>{formatPrice(subtotal + shipping)}</strong></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )
}