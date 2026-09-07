import { useState, useEffect } from 'react';
import type { Product } from '../../app/models/product';
import ProductList from './ProductList';
import agent from '../../app/api/agent';
import Spinner from '../../app/layout/Spinner';
import { Box, FormControl, FormControlLabel, FormLabel, Grid, Pagination, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import type { Brand } from '../../app/models/brand';
import type { Type } from '../../app/models/type';


const sortOptions = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

const compactTextSx = { fontSize: '0.8rem' };

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [types, setTypes] = useState<Type[]>([]);

  const [selectedSort, setSelectedSort] = useState<string>('asc');

  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  const [selectedBrandId, setSelectedBrandId] = useState<number>(0);
  const [selectedTypeId, setSelectedTypeId] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(1); // 1-based (agent expects 1-based)
  const [totalItems, setTotalItems] = useState<number>(0);
  const pageSize = 10;

  // — Fetch brands & types once on mount
  useEffect(() => {
    let mounted = true;
    const fetchRefs = async () => {
      try {
        const [b, t] = await Promise.all([agent.Store.brands(), agent.Store.types()]);
        if (!mounted) return;
        setBrands(b ?? []);
        setTypes(t ?? []);
      } catch (err) {
        console.error('Error loading brands/types:', err);
      }
    };
    fetchRefs();
    return () => { mounted = false; };
  }, []);

  // — Central useEffect: load products when pagination / filters / sort / search change
  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Build a request URL including page (0-based expected by backend), size, sort/order, and optional brand/type
        const sortField = 'name';
        const order = selectedSort === 'desc' ? 'desc' : 'asc';
        const pageZeroBased = Math.max(0, currentPage - 1);

        // Build URL explicitly (agent.Store.list will use the 'url' param as-is)
        let requestUrl = `products?page=${pageZeroBased}&size=${pageSize}&sort=${sortField}&order=${order}`;

        if (selectedBrandId !== 0) {
          requestUrl += `&brandId=${selectedBrandId}`;
        }
        if (selectedTypeId !== 0) {
          requestUrl += `&typeId=${selectedTypeId}`;
        }
        // If there is a search term, prefer the search endpoint
        if (searchTerm && searchTerm.trim() !== '') {
          const searchRes = await agent.Store.search(searchTerm.trim());
          const content = searchRes?.content ?? searchRes ?? [];
          if (!mounted) return;
          setProducts(content);
          setTotalItems(searchRes?.totalElements ?? content.length ?? 0);
        } else {
          // Call agent.Store.list with the constructed URL so sorting/params are respected
          const res = await agent.Store.list(currentPage, pageSize, selectedBrandId !== 0 ? selectedBrandId : undefined, selectedTypeId !== 0 ? selectedTypeId : undefined, requestUrl);
          const content = res?.content ?? res ?? [];
          if (!mounted) return;
          setProducts(content);
          setTotalItems(res?.totalElements ?? content.length ?? 0);
        }
      } catch (error) {
        console.error('Error retrieving products:', error);
        if (!mounted) return;
        setProducts([]);
        setTotalItems(0);
      } finally {
        // eslint-disable-next-line no-unsafe-finally
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
    // Dépendances : relance la récupération si l'une de ces valeurs change
  }, [currentPage, selectedSort, selectedBrandId, selectedTypeId, searchTerm, pageSize]);

  // Handlers
  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = (event.target as HTMLInputElement).value;
    setSelectedSort(selected);
    setCurrentPage(1);
  };

  const handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = (event.target as HTMLInputElement).value;
    const brand = brands.find((b) => b.name === selected);
    setSelectedBrand(selected);
    setSelectedBrandId(brand?.id ?? 0);
    setCurrentPage(1);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = (event.target as HTMLInputElement).value;
    const t = types.find((tt) => tt.name === selected);
    setSelectedType(selected);
    setSelectedTypeId(t?.id ?? 0);
    setCurrentPage(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // Search keydown handler (compatible avec MUI TextField)
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      // On met la pagination à 1, le useEffect central se chargera de la requête (en utilisant searchTerm)
      setCurrentPage(1);
    }
  };

  // UI rendering
  if (loading) return <Spinner message="Loading products..." />;

  if (!loading && totalItems === 0) {
    return <h3>Unable to load products.</h3>;
  }

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12 }}>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="subtitle1" sx={compactTextSx}>
            Displaying {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
          </Typography>
        </Box>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.max(1, Math.ceil(totalItems / pageSize))}
            color="primary"
            onChange={handlePageChange}
            page={currentPage}
            size="small"
            siblingCount={0}
          />
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <Paper sx={{ mb: 2 }}>
          <TextField
            label="Search Products"
            variant="outlined"
            fullWidth
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            slotProps={{ htmlInput: { style: compactTextSx } }}
          />
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <FormControl>
            <FormLabel id="sort-by-name-label" sx={compactTextSx}>Sort by Name</FormLabel>
            <RadioGroup aria-label="sort-by-name" name="sort-by-name" value={selectedSort} onChange={handleSortChange}>
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
            <RadioGroup aria-label="brands" name="brands" value={selectedBrand} onChange={handleBrandChange}>
              <FormControlLabel key={0} value="All" control={<Radio size="small" />} label="All" slotProps={{ typography: { sx: compactTextSx } }} />
              {brands.map((brand) => (
                <FormControlLabel key={brand.id} value={brand.name} control={<Radio size="small" />} label={brand.name} slotProps={{ typography: { sx: compactTextSx } }} />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <FormControl>
            <FormLabel id="types-label" sx={compactTextSx}>Types</FormLabel>
            <RadioGroup aria-label="types" name="types" value={selectedType} onChange={handleTypeChange}>
              <FormControlLabel key={0} value="All" control={<Radio size="small" />} label="All" slotProps={{ typography: { sx: compactTextSx } }} />
              {types.map((type) => (
                <FormControlLabel key={type.id} value={type.name} control={<Radio size="small" />} label={type.name} slotProps={{ typography: { sx: compactTextSx } }} />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 9 }}>
        <ProductList products={products} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.max(1, Math.ceil(totalItems / pageSize))}
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