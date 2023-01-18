import { createFormContext } from '@mantine/form';

interface CheckoutFormValues {
  contactEmail: string;
  contactPhone: string;
  fullName: string;
  delivery: {
    methodId: number;
    address: string;
    city: string;
    postalCode: string | undefined;
    country: string;
  };
  payment: {
    methodId: number;
  };
}

export const [CheckoutFormProvider, useCheckoutFormContext, useCheckoutForm] =
  createFormContext<CheckoutFormValues>();
