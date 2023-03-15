import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { FastifyRequest, FastifyReply } from "fastify";
import { RegisterUseCase } from "@/use-cases/register";
import { z } from "zod";
import { inspect } from "util";
import { UserAlreadyExists } from "@/use-cases/errors/user-already-exists";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8)
    });

    const { name, email, password } = registerBodySchema.parse(request.body);

        try {
            // const prismaUsersRepository = new PrismaUsersRepository();
            const usersRepository = new PrismaUsersRepository();
            const registerUseCase = new RegisterUseCase(usersRepository);

            await registerUseCase.execute({
                name, 
                email, 
                password,
            });
        } catch (err) {
            if (err instanceof UserAlreadyExists) {
                return reply.status(409).send({ message: err.message });
            }

            throw err;
        }

    return reply.status(201).send();
}