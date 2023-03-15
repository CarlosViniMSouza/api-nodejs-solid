import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

interface UseCaseRegister {
    name: string,
    email: string,
    password: string,
}

export async function registerUseCase({ name, email, password }: UseCaseRegister) {
    const password_hash = await hash(password, 4);

    const userWithSameEmail = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (userWithSameEmail) {
        throw new Error('Email already registered');
    }

    await prisma.user.create({
        data: { 
            name,
            email,
            password_hash,
        }
    });
}