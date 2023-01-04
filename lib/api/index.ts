import {
  AuthApi,
  CartsApi,
  CategoriesApi,
  Configuration,
  PagesApi,
  ProductRatingsApi,
  ProductsApi,
  SettingsApi,
  UsersApi,
} from './client';

export * from './client';

const configuration = new Configuration({
  basePath: process.env.API_PATH ?? 'http://localhost',
  middleware: [
    {
      onError: async (error) => {
        throw error.error;
      },
    },
  ],
});

const authApi = new AuthApi(configuration);
const settingsApi = new SettingsApi(configuration);
const pagesApi = new PagesApi(configuration);
const usersApi = new UsersApi(configuration);
const categoriesApi = new CategoriesApi(configuration);
const productsApi = new ProductsApi(configuration);
const productRatingsApi = new ProductRatingsApi(configuration);
const cartsApi = new CartsApi(configuration);

export {
  authApi,
  settingsApi,
  pagesApi,
  usersApi,
  categoriesApi,
  productsApi,
  productRatingsApi,
  cartsApi,
};
