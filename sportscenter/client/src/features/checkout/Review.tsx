
import type { Product } from "../../app/models/product";
import { useAppSelector } from "../../app/store/configureStore";
import BasketSummary from "../basket/BasketSummary";
import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";


export default function Review() {
  // Récupération de l'état du panier dans le store Redux
  const { basket } = useAppSelector((state) => state.basket);

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

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Image</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket?.items.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.pictureUrl && (
                    <img src={"/images/products/"+extractImageName(product)} alt="Product" width="50" height="50" />
                  )}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
              </TableRow>
            ))}            
          </TableBody>
        </Table>
      </TableContainer>
      <BasketSummary />
    </>
  )
}