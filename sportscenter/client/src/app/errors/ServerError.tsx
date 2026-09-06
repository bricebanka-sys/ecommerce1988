import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
export default function ServerError() {

  // Hook de navigation React Router v6/v7
  const navigate = useNavigate();

  // Gestionnaire de redirection vers l'accueil
  const handleGoHome = () => {
    navigate('/');
  };

  return (

      <Container component={Paper} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          component="img"
          sx={{
            height: 'auto',
            width: '100%',
            maxHeight: { xs: 233, md: 400 },
            maxWidth: { xs: 350, md: 400 },
            mb: 4,
          }}
          src="/images/server-error.png"
          alt="500 Server Error"
        />
        <Typography variant="h4" component="h1" gutterBottom>
          Oops! Something went wrong.
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          We're sorry, but an error occurred while processing your request.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGoHome}>
          Go Home
        </Button>
      </Container>

    );

}
