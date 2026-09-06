
import * as yup from 'yup';
import type { CheckoutFormValues } from '../../app/models/checkoutFormValues';


export const validationRules: yup.ObjectSchema<Partial<CheckoutFormValues>>[] = [
  // -------------------------------------------------------------
  // ÉTAPE 0 : Schéma de validation pour l'Adresse de Livraison
  // -------------------------------------------------------------
  yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    address1: yup.string().required("Address (line 1) is required"),
    address2: yup.string().optional(), // Champ optionnel
    city: yup.string().required('City is required'),
    state: yup.string().required("State / Region is required"),
    zip: yup.string().required('Zip code is required'),
    country: yup.string().required('Country is required'),
  }),

  // -------------------------------------------------------------
  // ÉTAPE 1 : Schéma pour le Récapitulatif de Commande (Review)
  // -------------------------------------------------------------
  // Aucune donnée textuelle à valider à cette étape
  yup.object({}),

  // -------------------------------------------------------------
  // ÉTAPE 2 : Schéma de validation pour le Paiement Bancaire
  // -------------------------------------------------------------
  yup.object({
    cardName: yup.string().required('Cardholder name is required'),
    cardNumber: yup.string().required('Card number is required'),
    expirationDate: yup.string().required("Expiration date is required"),
    cvv: yup.string().required('CVV code is required'),
  }),
];