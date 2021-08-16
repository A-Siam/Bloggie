import InvalidInputError from "@utils/api/user-input-error";
import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from "apollo-server";
import {
  AsyncFunction,
  errorsWrapper,
} from "@controllers/utils/errors-wrapper";
import {
  InvalidAuthenticationStateError,
  InvalidAuthorizationRoleError,
} from "@utils/api/access-errors";

/**
 * @description a wrapper that replace with error with suitable GraphQL errors
 * @param originalError your error type
 */
function apolloInvalidInputErrorWrapper<T>(wrappedFunction: AsyncFunction<T>) {
  return errorsWrapper(InvalidInputError, UserInputError, wrappedFunction);
}

/**
 * @description a wrapper against the authentication errors in our logic that replace it with a valid GraphQL error
 * @param wrappedFunction
 * @returns
 */
function apolloUnauthenticatedWrapper<T>(wrappedFunction: AsyncFunction<T>) {
  return errorsWrapper(
    InvalidAuthenticationStateError,
    AuthenticationError,
    wrappedFunction
  );
}

function apolloUnauthorizedWrapper<T>(wrappedFunction: AsyncFunction<T>) {
  return errorsWrapper(
    InvalidAuthorizationRoleError,
    ForbiddenError,
    wrappedFunction
  );
}
/**
 * @description a wrapper used to wrap apollo logic functions
 * @param wrappedFunction the logic function that needs to be caught for error
 */
export async function apolloErrorsWrapper<T>(
  wrappedFunction: AsyncFunction<T>
) {
  // using decorator design pattern we can include as much wrappers as we can here
  // editing guide for my future self
  // replace the wrapped function with another wrapper that takes the wrapped function
  return await apolloUnauthenticatedWrapper<T>(
    apolloInvalidInputErrorWrapper<T>(
      apolloUnauthorizedWrapper<T>(wrappedFunction)
    )
  )();
}
