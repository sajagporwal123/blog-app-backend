import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract the user from the request object.
 *
 * This decorator can be used in route handlers to directly access
 * the user information that is typically attached to the request
 * object by authentication middleware or guards.
 *
 * @param data - Optional data that can be passed to the decorator
 * @param ctx - The execution context which provides access to the request
 * @returns The user object from the request
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): any => {
    // Get the request object from the execution context
    const request = ctx.switchToHttp().getRequest();
    // Return the user object from the request
    return request.user;
  },
);
