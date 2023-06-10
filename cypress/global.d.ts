declare namespace Cypress {
  interface Chainable {
    apiGET<T = any>(path: string): Chainable<Response<T>>;
    apiPOST<T = any>(path: string, body: RequestBody): Chainable<Response<T>>;
    apiPATCH<T = any>(path: string, body: RequestBody): Chainable<Response<T>>;
    apiPUT<T = any>(path: string, body: RequestBody): Chainable<Response<T>>;
    apiDELETE<T = any>(path: string): Chainable<Response<T>>;
    loginAdmin(): void;
    clearTestData(): void;
    clickLink(): Chainable<JQuery<HTMLAnchorElement>>;
    revalidatePath(path: string): void;
    loadFixtures(paths: string[]): void;
    getAliases<V extends Array<any>, T extends ReadonlyArray<string> = ReadonlyArray<string>>(aliases: T): Chainable<V>;
  }
}
