import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Custom decorator to define if a route is public or not.
 *
 * This decorator makes all the authentication and authorization middlewares
 * skip the route where this decorator is applied.
 */
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
