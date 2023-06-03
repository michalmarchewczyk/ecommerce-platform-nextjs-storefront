declare namespace Cypress {
  interface Chainable {
    apiGET<T = any>(path: string): Chainable<Response<T>>;
    apiPOST<T = any>(path: string, body: RequestBody): Chainable<Response<T>>;
    apiPATCH<T = any>(path: string, body: RequestBody): Chainable<Response<T>>;
    apiPUT<T = any>(path: string, body: RequestBody): Chainable<Response<T>>;
    apiDELETE<T = any>(path: string): Chainable<Response<T>>;
    loginAdmin(): void;
    revalidatePath(path: string): void;
  }
}
