
export type AsyncFunction = () => Promise<any>;

export async function ErrorsWrapper(
  oldErrorClass: any,
  newError: any,
  wrappedFunction: AsyncFunction
) {
  try {
    await wrappedFunction();
  } catch (e) {
    if (e instanceof oldErrorClass) {
      throw new newError(e.message);
    }
    throw e;
  }
}
