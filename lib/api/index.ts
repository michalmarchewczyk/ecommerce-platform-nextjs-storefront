import {
  AuthApi,
  CartsApi,
  CategoriesApi,
  Configuration,
  DeliveryMethodsApi,
  OrdersApi,
  PagesApi,
  PaymentMethodsApi,
  ProductRatingsApi,
  ProductsApi,
  ReturnsApi,
  SettingsApi,
  UsersApi,
  WishlistsApi,
} from './client';

export * from './client';

export const API_URL =
  process.env.API_PATH ??
  process.env.NEXT_PUBLIC_API_PATH ??
  'http://localhost';

const configuration = new Configuration({
  basePath: API_URL,
  middleware: [
    {
      onError: async (error) => {
        throw error.error;
      },
    },
  ],
  credentials: 'include',
});

const authApi = new AuthApi(configuration);
const settingsApi = new SettingsApi(configuration);
const pagesApi = new PagesApi(configuration);
const usersApi = new UsersApi(configuration);
const categoriesApi = new CategoriesApi(configuration);
const productsApi = new ProductsApi(configuration);
const productRatingsApi = new ProductRatingsApi(configuration);
const cartsApi = new CartsApi(configuration);
const deliveryMethodsApi = new DeliveryMethodsApi(configuration);
const paymentMethodsApi = new PaymentMethodsApi(configuration);
const ordersApi = new OrdersApi(configuration);
const returnsApi = new ReturnsApi(configuration);
const wishlistsApi = new WishlistsApi(configuration);

export {
  authApi,
  settingsApi,
  pagesApi,
  usersApi,
  categoriesApi,
  productsApi,
  productRatingsApi,
  cartsApi,
  deliveryMethodsApi,
  paymentMethodsApi,
  ordersApi,
  returnsApi,
  wishlistsApi,
};
