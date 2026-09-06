

export interface CheckoutFormValues {
  // Étape 0 : Adresse de livraison
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;

  // Étape 2 : Paiement bancaire
  cardName: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
}