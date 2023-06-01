declare namespace Cypress {
  interface Chainable {
    loginAdmin(): void;
    revalidatePath(path: string): void;
  }
}
