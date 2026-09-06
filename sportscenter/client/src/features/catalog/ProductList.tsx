import { Grid } from '@mui/material';
import type { Product } from '../../app/models/product';
import ProductCard from './ProductCard';


// 💡 Définition du contrat de type pour les Props reçues par le composant
interface Props {
  products: Product[];
}
export default function ProductList({ products }: Props) {
  return (
    // 💡 Grille conteneur MUI avec un espacement (spacing) de 4 entre les éléments
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid size={4} key={product.id}>
          {/* Le composant ProductCard sera injecté ici */}
           <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}