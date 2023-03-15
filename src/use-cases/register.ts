import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
// import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";

interface UseCaseRegister {
    name: string,
    email: string,
    password: string,
}

export class RegisterUseCase {
    constructor(private usersRepository: any) {}

    async execute({name, email, password}: UseCaseRegister) {
        const password_hash = await hash(password, 4);
    
        const userWithSameEmail = await prisma.user.findUnique({
            where: {
                email,
            },
        });
    
        if (userWithSameEmail) {
            throw new Error('Email already registered');
        }
    
        // const prismaUsersRepository = new PrismaUsersRepository();
    
        await this.usersRepository.create({
            name,
            email,
            password_hash,
        });
    }
}