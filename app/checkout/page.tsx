'use client';

import { Stepper } from '@mantine/core';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconCash,
  IconChecks,
  IconShoppingCart,
  IconTruckDelivery,
} from '@tabler/icons';
import useSWR from 'swr';
import { isEmail, isNotEmpty } from '@mantine/form';
import { isValidPhoneNumber } from 'libphonenumber-js';
import CheckoutShipping from './CheckoutShipping';
import CheckoutPayment from './CheckoutPayment';
import CheckoutConfirm from './CheckoutConfirm';
import { CheckoutFormProvider, useCheckoutForm } from './checkoutForm';
import CheckoutCompleted from './CheckoutCompleted';
import { cartsApi, ordersApi } from '../../lib/api';

export default function Page() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [orderId, setOrderId] = useState<number | null>(null);

  const updateStep = (value: number) => {
    if (value === 0) {
      router.push('/cart');
    } else {
      setStep(value);
    }
  };

  const { data: cart } = useSWR('cart', () => cartsApi.getCart());

  const form = useCheckoutForm({
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
        methodId: (value) =>
          value === -1 ? 'Payment method is required' : null,
      },
    },
  });

  const submit = async () => {
    const orderItems = cart?.items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
    if (!orderItems) return;
    const orderDto = { ...form.values, items: orderItems };
    orderDto.contactPhone = `+${orderDto.contactPhone}`;
    orderDto.delivery.postalCode = orderDto.delivery.postalCode || undefined;
    const order = await ordersApi.createOrder({
      orderCreateDto: orderDto,
    });
    setOrderId(order.id);
    updateStep(4);
  };

  return (
    <CheckoutFormProvider form={form}>
      <form onSubmit={form.onSubmit(submit)}>
        <Stepper
          active={step}
          onStepClick={updateStep}
          breakpoint="sm"
          allowNextStepsSelect={false}
        >
          <Stepper.Step
            label="Cart"
            description="Selected products"
            icon={<IconShoppingCart />}
          />
          <Stepper.Step
            label="Shipping"
            description="Contact & address info"
            icon={<IconTruckDelivery />}
          >
            <CheckoutShipping
              back={() => updateStep(0)}
              next={() => updateStep(2)}
            />
          </Stepper.Step>
          <Stepper.Step
            label="Payment"
            description="Payment method"
            icon={<IconCash />}
          >
            <CheckoutPayment
              back={() => updateStep(1)}
              next={() => updateStep(3)}
            />
          </Stepper.Step>
          <Stepper.Step label="Confirmation" icon={<IconChecks />}>
            <CheckoutConfirm back={() => updateStep(2)} />
          </Stepper.Step>
          <Stepper.Completed>
            <CheckoutCompleted orderId={orderId} />
          </Stepper.Completed>
        </Stepper>
      </form>
    </CheckoutFormProvider>
  );
}
