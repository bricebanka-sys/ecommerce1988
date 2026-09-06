
// import React from 'react';

import { 
    Avatar, 
    Button, 
    CssBaseline, 
    TextField,  
    Grid, 
    Box,
    Typography, 
    Container, 
} from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { toast } from 'react-toastify';
import agent from '../../app/api/agent';
// import { Link as RouterLink } from 'react-router-dom';
// import Link from '@mui/material/Link';

// import { Copyright } from '@mui/icons-material';

/**
 * Composant représentant la page d'inscription (Register).
 */
export default function RegisterPage() {

  // 1. Déclaration de l'état local pour stocker les données du formulaire
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    // ... à l'intérieur du composant, ajoute :
    const navigate = useNavigate();

    
    // 2. Gestionnaire d'événement générique pour les changements dans les champs de saisie
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        // Mise à jour dynamique de l'état en conservant les valeurs précédentes (Spread Operator)
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
          await agent.Account.register(formData);
          toast.success('Registration successful! Please sign in.');
          navigate('/login'); // Redirection vers la page de connexion après inscription
      } catch (error: unknown) {
          console.error('Registration failed:', error);
          toast.error('Registration failed. Please check your details and try again.');
      }
  };
    
    return (
       <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            
            <Typography component="h1" variant="h5">
              Register
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  {/* Champ Nom d'utilisateur */}
                  <TextField
                    margin="normal"
                    autoComplete="username"
                    name="username"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    autoFocus
                    value={formData.username}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  {/* Champ Adresse E-mail */}
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  {/* Champ Mot de passe */}
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button>

              <Grid container sx={{ mt: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Grid>
                  <Link to="/login" style={{ textDecoration: 'underline' }}>
                    <Typography variant="body2" color="secondary.main">
                      Already have an account? Sign in
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
    );
}