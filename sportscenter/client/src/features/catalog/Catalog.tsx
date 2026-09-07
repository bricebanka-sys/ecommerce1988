import { useState, useEffect } from 'react';
import type { Product } from '../../app/models/product';
import ProductList from './ProductList';
import agent from '../../app/api/agent';
import Spinner from '../../app/layout/Spinner';
import { Box, FormControl, FormControlLabel, FormLabel, Grid, Pagination, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import type { Brand } from '../../app/models/brand';
import type { Type } from '../../app/models/type';


// Déclaration des options de tri pour l'interface utilisateur
const sortOptions = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

// 🔧 Objet de style réutilisable pour réduire uniformément la taille du texte (~30%)
const compactTextSx = { fontSize: '0.8rem' };

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Stockage des listes de références
  const [brands, setBrands] = useState<Brand[]>([]);
  const [types, setTypes] = useState<Type[]>([]);

  // État du tri (par défaut 'nameAsc')
  const [selectedSort, setSelectedSort] = useState<string>('asc');

  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  // États de sélection des marques et des types (0 = Toutes)
  const [selectedBrandId, setSelectedBrandId] = useState<number>(0);
  const [selectedTypeId, setSelectedTypeId] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // États pour la gestion de la pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const pageSize = 10;




  // useEffect(() => {
  //     // Appel centralisé via l'Agent API
  //     agent.Store.list()
  //       .then((response) => setProducts(response.content)) // Déstructuration de la réponse pour extraire le tableau de produits
  //       .catch((error) => console.error("Error retrieving the products :", error))
  //       .finally(() => setLoading(false));
  //   }, []); // Le tableau de dépendances vide évite les boucles infinies de rendu


  useEffect(() => {
    
      Promise.all([
        agent.Store.list(currentPage, pageSize),
        agent.Store.brands(),
        agent.Store.types()
      ])
        .then(([productsRes, brandsRes, typesRes]) => {
          // 1. Mise à jour des produits (extraction du contenu de la ré paginée Spring Boot)
          setProducts(productsRes.content || productsRes);

          setTotalItems(productsRes.totalElements); // Mise à jour du nombre total d'éléments pour la pagination
          
          // 2. Mise à jour du tableau des marques
          setBrands(brandsRes);
          
          // 3. Mise à jour du tableau des catégories
          setTypes(typesRes);
        })

        .catch((error) => console.error("Error retrieving the data:", error))
        .finally(() => setLoading(false)); // Fin du chargement, que la requête réussisse ou échoue
    
  },[currentPage, pageSize]); // Le tableau de dépendances vide évite les boucles infinies de rendu)
  
  const loadProducts = (selectedSort: string, searchKeyword: string = '') => {
      // Activer le spinner de chargement
      setLoading(true);
      const page = currentPage - 1
      const size = pageSize;
      const brandId = selectedBrandId !==0 ? selectedBrandId : undefined;
      const typeId = selectedTypeId !==0 ? selectedTypeId : undefined;

      // Définition du champ de tri (par défaut 'name')
      const sort = 'name';

      // Analyse de la direction du tri via une condition ternaire
      const order = selectedSort === 'desc' ? 'desc' : 'asc';

      // Construction de l'URL initiale avec tri et mot-clé de recherche
      let url = `${agent.Store.apiUrl}?sort=${sort}&order=${order}`;

      if (brandId !== undefined || typeId !== undefined) {
        url += '&';
        // Concaténation du paramètre brandId
        if (brandId !== undefined) url += `brandId=${brandId}&`;
        // Concaténation du paramètre typeId
        if (typeId !== undefined) url += `typeId=${typeId}&`;
        // Nettoyage : Suppression du '&' traînant à la fin de l'URL via une expression régulière
        url = url.replace(/&$/, ''); // Suppression du dernier '&' si présent
      }

      if (searchKeyword) {
        console.log("Searching for keyword:", searchKeyword);
        agent.Store.search(searchKeyword)
          .then((productRes) => {
            setProducts(productRes.content);
            setTotalItems(productRes.length); // Mise à jour du nombre total d'éléments pour la pagination
          })
          .catch((error) => console.error("Error searching products:", error))
          .finally(() => setLoading(false));
      }else{
        agent.Store.list(page, size, undefined, undefined, url)
        .then((productRes) => {
          setProducts(productRes.content);
          setTotalItems(productRes.totalElements); // Mise à jour du nombre total d'éléments pour la pagination
        })
        .catch((error) => console.error("Error retrieving products:", error))
        .finally(() => setLoading(false));
      }
    }

    // Déclenchement du chargement des produits à chaque changement de tri, marque ou type
    useEffect(() => {
      loadProducts(selectedSort);
    }, [selectedSort, selectedBrandId, selectedTypeId]); 

    const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedSort = (event.target as HTMLInputElement).value;
      setSelectedSort(selectedSort);
      loadProducts(selectedSort); // Rechargement des produits avec le nouveau tri et le terme de recherche actuel
    }

    const handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedBrand = (event.target as HTMLInputElement).value;
      const brand = brands.find(b => b.name === selectedBrand);
      setSelectedBrand(selectedBrand);            
      if (brand) {        
        setSelectedBrandId(brand.id);
        loadProducts(selectedSort); // Rechargement des produits avec le nouveau tri et le terme de recherche actuel
      }
    };

    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedType = (event.target as HTMLInputElement).value;
      const type = types.find(t => t.name === selectedType);
      setSelectedType(selectedType);      
      if (type) {
        setSelectedTypeId(type.id);
        loadProducts(selectedSort); // Rechargement des produits avec le nouveau tri et le terme de recherche actuel
      }
    }
    
    // Gestionnaire d'événement de changement de page
const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
  setCurrentPage(page);
};

    // 🔧 CORRECTION : le contrôle du spinner passe AVANT le contrôle "produits vides",
    // sinon le message d'erreur s'affichait brièvement pendant le tout premier chargement
    // (products vaut [] par défaut tant que la requête n'a pas répondu)
    if (loading) return <Spinner message="Loading products..." />;

    if (!products || products.length === 0) {
      return <h3>Unable to load products.</h3>;
    }

    return (
      <Grid container spacing={4}>

        <Grid size={12}>
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={compactTextSx}>
              Displaying {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
            </Typography>
          </Box>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={Math.ceil(totalItems / pageSize)}
              color="primary"
              onChange={handlePageChange}
              page={currentPage}
              size="small"
              siblingCount={0}
            />
          </Box>
        </Grid>

        {/* Panneau de Gauche : Filtres et Recherche (responsive : pleine largeur sur mobile, 3 colonnes à partir de md) */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ mb: 2 }}>
            <TextField
              label="Search Products"
              variant="outlined"
              fullWidth
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  loadProducts(selectedSort, searchTerm); // Appel de la fonction loadProducts avec le tri et le terme de recherche
                }
              }}
              slotProps={{ htmlInput: { style: compactTextSx } }}
            />
          </Paper>
          <Paper sx={{ mb: 2, p: 2 }}>
            <FormControl>
              <FormLabel id="sort-by-name-label" sx={compactTextSx}>Sort by Name</FormLabel>
              <RadioGroup
                aria-label="sort-by-name"
                name="sort-by-name"
                value={selectedSort}
                onChange={handleSortChange}
              >
                {sortOptions.map(({ value, label }) => (
                  <FormControlLabel
                    key={value}
                    value={value}
                    control={<Radio size="small" />}
                    label={label}
                    slotProps={{ typography: { sx: compactTextSx } }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>

          <Paper sx={{ mb: 2, p: 2 }}>
            <FormControl>
              <FormLabel id="brands-label" sx={compactTextSx}>Brands</FormLabel>
              <RadioGroup
                aria-label="brands"
                name="brands"
                value={selectedBrand}
                onChange={handleBrandChange}
              >
                {brands.map((brand) => (
                  <FormControlLabel
                    key={brand.id}
                    value={brand.name}
                    control={<Radio size="small" />}
                    label={brand.name}
                    slotProps={{ typography: { sx: compactTextSx } }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>

          <Paper sx={{ mb: 2, p: 2 }}>
            <FormControl>
              <FormLabel id="types-label" sx={compactTextSx}>Types</FormLabel>
              <RadioGroup
                aria-label="types"
                name="types"
                value={selectedType}
                onChange={handleTypeChange}
              >
                {types.map((type) => (
                  <FormControlLabel
                    key={type.id}
                    value={type.name}
                    control={<Radio size="small" />}
                    label={type.name}
                    slotProps={{ typography: { sx: compactTextSx } }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>

        </Grid>

        {/* Panneau de Droite : Liste des Produits (responsive : pleine largeur sur mobile, 9 colonnes à partir de md) */}
        <Grid size={{ xs: 12, md: 9 }}>
          <ProductList products={products} />
        </Grid>

        <Grid size={12}>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={Math.ceil(totalItems / pageSize)}
              color="primary"
              onChange={handlePageChange}
              page={currentPage}
              size="small"
              siblingCount={0}
            />
          </Box>
        </Grid>
      </Grid>
    );
}