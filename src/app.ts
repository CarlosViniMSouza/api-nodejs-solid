import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import { appRoutes } from "./http/routes";

export const app = fastify();

app.register(appRoutes);

// Error Handling
app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: 'Validation Error!', 
            issues: error.format()
        });
    }

    if (env.NODE_ENV !== 'production') {
        console.log(error);
    } else {
        // Log to external tool
    }

    return reply.status(500).send({ message: 'Unknown Error!'});
})