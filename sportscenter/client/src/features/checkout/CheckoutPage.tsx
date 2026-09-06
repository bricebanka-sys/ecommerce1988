import { Box, Button, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import AddressForm from "./AddressForm";
import { useState } from "react";
import { useAppDispatch } from "../../app/store/configureStore";
import { validationRules } from "./validationRules";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import agent from "../../app/api/agent";
import { setBasket } from "../basket/basketSlice";
import { toast } from "react-toastify";
import type { BasketItem } from "../../app/models/basket";
import type { CheckoutFormValues } from "../../app/models/checkoutFormValues";

// Liste ordonnée des étapes du Wizard
const steps = ['Shipping Address', 'Order Summary', 'Payment Details'];

// Rendu du composant enfant correspondant à l'étape active
function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <Review />;
    case 2:
      return <PaymentForm />;
    default:
      throw new Error('Unknown step');
  }
}

export default function CheckoutPage() {
  // État de progression de l'assistant (Step 0, Step 1, Step 2)
  const [activeStep, setActiveStep] = useState<number>(0);

  // Numéro de commande généré après validation backend
  const [orderNumber, setOrderNumber] = useState<number>(0);

  // État de chargement pendant la création de la commande
  const [loading, setLoading] = useState<boolean>(false);

  // Dispatch Redux pour l'envoi d'actions (ex: vider le panier après commande)
  const dispatch = useAppDispatch();

  // 1. Sélection de la règle de validation correspondant à l'étape active
  const currentValidationRule = validationRules[activeStep];

  // 2. Initialisation de React Hook Form avec le résolveur Yup dynamique
  const methods = useForm<CheckoutFormValues>({
    mode: 'all', // Validation en temps réel sur les événements 'onChange' et 'onBlur'
    resolver: yupResolver(currentValidationRule as never),
  });

  // Fonction principale de gestion du Wizard
  const handleNext = async () => {
    // 1. On ne valide via trigger() QUE s'il existe une règle de validation pour cette étape (ex: étape 0 et étape 2)
    if (currentValidationRule) {
      const isValid = await methods.trigger();
      if (!isValid) {
        console.log("Form is invalid, cannot proceed to next step.");
        return;
      }
    }

    // 2. Si nous ne sommes PAS à la dernière étape (index 2), nous avançons simplement dans le Stepper
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      return;
    }

    // 3. Dernière étape (index 2 - Payment Details) : Création et envoi de la commande au clic sur "Place order"
    try {
      setLoading(true);
      const basket = await agent.Basket.get();
      if (basket) {
        const subTotal = calculateSubTotal(basket.items);
        const deliveryFee = 200; // Frais de livraison de base
        const data = methods.getValues();

        // Construction du DTO conforme au modèle Spring Boot
        const orderDto = {
          basketId: basket.id,
          shippingAddress: {
            name: `${data.firstName} ${data.lastName}`,
            address1: data.address1,
            address2: data.address2,
            city: data.city,
            state: data.state,
            zipCode: data.zip,
            country: data.country,
          },
          subTotal: subTotal,
          deliveryFee: deliveryFee,
        };

        // Appels API asynchrone pour poster le DTO de commande
        const orderId = await agent.Orders.create(orderDto);
        setOrderNumber(orderId);
        setActiveStep(activeStep + 1); // Avancer à l'écran de confirmation finale
        
        // Nettoyage du panier et du store
        await agent.Basket.deleteBasket(basket.id);
        dispatch(setBasket(null));
        localStorage.removeItem('basket_id');
        localStorage.removeItem('basket');
      } else {
        toast.error('Basket not found in local storage.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Error submitting order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction utilitaire pour calculer le sous-total du panier
  const calculateSubTotal = (items: BasketItem[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Retour à l'étape précédente du Stepper
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <FormProvider {...methods}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h4" align="center">
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <>
          {activeStep === steps.length ? (
            <>
              <Typography variant="h5" gutterBottom>
                Thank you for your order.
              </Typography>
              <Typography variant="subtitle1">
                Your order number is #{orderNumber}. We have emailed your order confirmation, and will send you an update when your order has shipped.
              </Typography>
            </>
          ) : (
            <>
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? "Place order" : "Next"}
                </Button>
              </Box>
            </>
          )}
        </>
      </Paper>
    </FormProvider>
  );
}