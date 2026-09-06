// import React from 'react';

import { 
    Avatar,
    CssBaseline, 
    TextField, 
    FormControlLabel, 
    Checkbox, 
    Link, 
    Grid, 
    Box,
    Typography, 
    Container, 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { store, useAppDispatch } from '../../app/store/configureStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, type FieldValues } from 'react-hook-form';
import { toast } from 'react-toastify';
//import LoadingButton from '@mui/lab/LoadingButton';
import { LoadingButton } from '@mui/lab';
import { signInUser } from './accountSlice';
// import { Copyright } from '@mui/icons-material';
// import { Link as RouterLink } from 'react-router-dom';

// 1. Initialisez le thème par défaut ici :
// const defaultTheme = createTheme();

export default function SignInPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting, isValid } 
    } = useForm({
        mode: 'onTouched' // Active la validation dès que le champ est touché
    });

    // Gestion de la soumission du formulaire de connexion
    async function submitForm(data: FieldValues) {

      try {
          await dispatch(signInUser(data));
          const {user} = store.getState().account;
          if (user) {
            // Redirection par defaut vers l'origine ou la boutique par défaut ou vers la page depuis laquelle il a été intercepté.
            navigate(location.state?.from || '/store');
          }else{
            toast.error('Sign in Failed. Please try again.');
          }
          
      } catch (error: unknown) {
          console.log('Error signing:', error);
          toast.error('Sign in Failed. Please try again.');
      }
    }

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
            Sign in
          </Typography>

          <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"                       
              autoFocus
              {...register('username', { 
                  required: 'Username field is required' 
              })}
              error={!!errors.username}
              helperText={errors.username?.message as string}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password', { 
                  required: 'Password field is required' 
              })}
              error={!!errors.password}
              helperText={errors.password?.message as string}
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />

            <LoadingButton 
              loading={isSubmitting} disabled={!isValid}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </LoadingButton >

            <Grid container sx={{ mt: 1, justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid>
                <Link href="#" variant="body2" color="secondary.main">
                  Forgot password?
                </Link>
              </Grid>
              
              <Grid>
                <Link href="/register" variant="body2" color="secondary.main">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        
      </Container>
        
    );
}