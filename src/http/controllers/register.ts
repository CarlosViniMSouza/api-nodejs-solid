import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";
import { FastifyRequest, FastifyReply } from "fastify";
import { RegisterUseCase } from "@/use-cases/register";
import { z } from "zod";
import { MemoryUsersRepository } from "@/repositories/memory-users-repository";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8)
    });

    const { name, email, password } = registerBodySchema.parse(request.body);

        try {
            // const prismaUsersRepository = new PrismaUsersRepository();
            const usersRepository = new MemoryUsersRepository();
            const registerUseCase = new RegisterUseCase(usersRepository);

            await registerUseCase.execute({
                name, 
                email, 
                password,
            });
        } catch (err) {
            return reply.status(409).send();
        }

    return reply.status(201).send();
}