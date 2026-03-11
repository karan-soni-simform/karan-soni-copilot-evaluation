import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema, ZodIssue } from 'zod';
import { ApiError } from '../utils';

/**
 * Validation source in request
 */
type ValidationSource = 'body' | 'query' | 'params';

/**
 * Format Zod errors into a readable structure
 */
const formatZodErrors = (error: ZodError): Record<string, string[]> => {
  const formattedErrors: Record<string, string[]> = {};
  const issues: ZodIssue[] = error.issues || [];

  issues.forEach((issue: ZodIssue) => {
    const path = issue.path.join('.') || 'value';
    if (!formattedErrors[path]) {
      formattedErrors[path] = [];
    }
    formattedErrors[path].push(issue.message);
  });

  return formattedErrors;
};

/**
 * Middleware factory for validating request data against a Zod schema
 */
export const validateRequest = (
  schema: ZodSchema,
  source: ValidationSource = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const dataToValidate = req[source];
      const validatedData = schema.parse(dataToValidate);

      // Store validated data back to request
      if (source === 'body') {
        req.body = validatedData;
      } else if (source === 'query') {
        (req as Request & { validatedQuery: unknown }).validatedQuery = validatedData;
      } else if (source === 'params') {
        (req as Request & { validatedParams: unknown }).validatedParams = validatedData;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodErrors(error);
        throw ApiError.validationError('Validation failed', formattedErrors);
      }
      throw error;
    }
  };
};

/**
 * Middleware for validating multiple sources at once
 */
export const validateMultiple = (validations: { schema: ZodSchema; source: ValidationSource }[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const allErrors: Record<string, string[]> = {};

    for (const { schema, source } of validations) {
      try {
        const dataToValidate = req[source];
        const validatedData = schema.parse(dataToValidate);

        if (source === 'body') {
          req.body = validatedData;
        } else if (source === 'query') {
          (req as Request & { validatedQuery: unknown }).validatedQuery = validatedData;
        } else if (source === 'params') {
          (req as Request & { validatedParams: unknown }).validatedParams = validatedData;
        }
      } catch (error) {
        if (error instanceof ZodError) {
          const formatted = formatZodErrors(error);
          Object.entries(formatted).forEach(([key, messages]) => {
            const prefixedKey = `${source}.${key}`;
            allErrors[prefixedKey] = messages;
          });
        } else {
          throw error;
        }
      }
    }

    if (Object.keys(allErrors).length > 0) {
      throw ApiError.validationError('Validation failed', allErrors);
    }

    next();
  };
};
