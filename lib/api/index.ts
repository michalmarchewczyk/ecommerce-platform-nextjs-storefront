import {
  AuthApi,
  CategoriesApi,
  Configuration,
  ProductsApi,
  SettingsApi,
  UsersApi,
} from './client';

export * from './client';

const configuration = new Configuration({
  basePath: 'http://localhost',
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
const usersApi = new UsersApi(configuration);
const categoriesApi = new CategoriesApi(configuration);
const productsApi = new ProductsApi(configuration);

export { authApi, settingsApi, usersApi, categoriesApi, productsApi };
