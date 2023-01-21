import { createFormContext, isEmail, isNotEmpty } from '@mantine/form';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { UseFormInput } from '@mantine/form/lib/types';

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

export const checkoutFormOptions: UseFormInput<CheckoutFormValues> = {
  initialValues: {
    contactEmail: '',
    contactPhone: '',
    fullName: '',
    delivery: {
      methodId: -1,
      address: '',
      city: '',
      postalCode: undefined,
      country: '',
    },
    payment: {
      methodId: -1,
    },
  },
  validateInputOnChange: false,
  validateInputOnBlur: true,
  validate: {
    contactEmail: isEmail('Invalid email'),
    contactPhone: (value) => {
      if (parseInt(value, 10) < 0) {
        return 'Phone is required';
      }
      if (parseInt(value, 10) > 0 && !isValidPhoneNumber(`+${value}`)) {
        return 'Invalid phone number';
      }
      return null;
    },
    fullName: isNotEmpty('Enter your full name'),
    delivery: {
      address: isNotEmpty('Delivery address is required'),
      city: isNotEmpty('Delivery city is required'),
      country: isNotEmpty('Delivery country is required'),
      methodId: (value) =>
        value === -1 ? 'Delivery method is required' : null,
    },
    payment: {
      methodId: (value) => (value === -1 ? 'Payment method is required' : null),
    },
  },
};
