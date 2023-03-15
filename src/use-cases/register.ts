import { hash } from "bcryptjs";
import { User } from "@prisma/client";
import { UserAlreadyExists } from "./errors/user-already-exists";
import { UsersRepository } from "@/repositories/users-repository";

interface RegisterUseCaseRegister {
    name: string,
    email: string,
    password: string,
}

interface RegisterUseCaseResponse {
    user: User
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({
        name, email, password
    }: RegisterUseCaseRegister): Promise<RegisterUseCaseResponse> {
        const password_hash = await hash(password, 4);
    
        const userWithSameEmail = await this.usersRepository.findByEmail(email);
    
        if (userWithSameEmail) {
            throw new UserAlreadyExists();
        }
    
        const user = await this.usersRepository.create({
            name,
            email,
            password_hash,
        });

        return {
            user,
        }
    }
}