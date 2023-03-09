import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3030),
});

const envValidationSchema = envSchema.safeParse(process.env);

if (envValidationSchema.success === false) {
    console.error(
        '❓ Validation Error!',
        envValidationSchema.error.format()
    );

    throw new Error('❓ Validation Error!');
}

export const env = envValidationSchema.data;
