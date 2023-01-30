'use client';

import { Stepper } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconCash,
  IconChecks,
  IconShoppingCart,
  IconTruckDelivery,
} from '@tabler/icons';
import useSWR from 'swr';
import { cartsApi, ordersApi } from '@lib/api';
import CheckoutShipping from './steps/CheckoutShipping';
import CheckoutPayment from './steps/CheckoutPayment';
import CheckoutConfirm from './steps/CheckoutConfirm';
import {
  checkoutFormOptions,
  CheckoutFormProvider,
  useCheckoutForm,
} from './checkoutForm';
import CheckoutCompleted from './steps/CheckoutCompleted';

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

  const form = useCheckoutForm(checkoutFormOptions);

  useEffect(() => {
    const storedValues = localStorage.getItem('checkout-form');
    if (storedValues) {
      try {
        form.setValues(JSON.parse(storedValues));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (form.isTouched()) {
      localStorage.setItem('checkout-form', JSON.stringify(form.values));
    }
  }, [form.values]);

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
    await cartsApi.updateCart({ cartDto: { items: [] } });
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
