import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { AuthenticateUseCase } from "@/use-cases/authenticate";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(8)
    });

    const { email, password } = authenticateBodySchema.parse(request.body);

        try {
            // const prismaUsersRepository = new PrismaUsersRepository();
            const usersRepository = new PrismaUsersRepository();
            const authenticateUseCase = new AuthenticateUseCase(usersRepository);

            await authenticateUseCase.execute({
                email, 
                password,
            });
        } catch (err) {
            if (err instanceof InvalidCredentialsError) {
                return reply.status(400).send({ message: err.message });
            }

            throw err;
        }

    return reply.status(200).send();
}