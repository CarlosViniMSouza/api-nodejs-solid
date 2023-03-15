import { hash } from "bcryptjs";
import { UsersRepository } from "@/repositories/users-repository";

interface UseCaseRegister {
    name: string,
    email: string,
    password: string,
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({name, email, password}: UseCaseRegister) {
        const password_hash = await hash(password, 4);
    
        const userWithSameEmail = await this.usersRepository.findByEmail(email);
    
        if (userWithSameEmail) {
            throw new Error('Email already registered');
        }
    
        await this.usersRepository.create({
            name,
            email,
            password_hash,
        });
    }
}