
import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';

// Interface définissant les propriétés (Props) acceptées par le composant
interface Props {
  message?: string;
}

export default function Spinner({ message = 'Loading...' }: Props) {
  return (
    <Backdrop open={true} invisible={true}>
      <Box         
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', // ou selon votre besoin
        }}
      >
        {/* Indicateur de chargement circulaire */}
        <CircularProgress size={100} color="secondary" />

        {/* Message de chargement sous le spinner */}
        <Typography
          variant="h4"
          sx={{ mt:2 }}
        >
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
}