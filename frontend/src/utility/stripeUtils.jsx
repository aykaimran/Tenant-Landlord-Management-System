import { loadStripe } from '@stripe/stripe-js';

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe('pk_test_51RGiEHQ0TwSjjDznFucHtwPuSWGsxNgqvhIND4w6WvMvC86wf0jH1DY0i7Qs4yYCluR4B3O4IJL974FIHb1TGzh100ffQcFpdI');
  }
  return stripePromise;
};

export default getStripe;