import { compare } from 'bcryptjs';
import { RegisterUseCase } from './register';
import { beforeEach, describe, expect, it } from 'vitest';
import { UserAlreadyExists } from './errors/user-already-exists';
import { MemoryUsersRepository } from '@/repositories/memory/memory-users-repository';

let usersRepository: MemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case Tests', () => {
    beforeEach(() => {
        usersRepository = new MemoryUsersRepository();
        sut = new RegisterUseCase(usersRepository);
    });

    it('user should be able to register', async () => {
        const { user } =  await sut.execute({
            name: 'Carlos Souza',
            email: 'vinisouza1055@email.com',
            password: '123fgh#%$'
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('should hash user password after register', async () => {
        const { user } =  await sut.execute({
            name: 'Carlos Souza',
            email: 'vinisouza1055@email.com',
            password: '123fgh#%$'
        });

        const isPasswordHashed = await compare(
            '123fgh#%$', 
            user.password_hash
        );

        expect(isPasswordHashed).toBe(true);
    });

    it('should not be able to register with same email twice', async () => {
        const email = 'vinisouza1055@email.com';

        await sut.execute({
            name: 'Carlos Souza',
            email,
            password: '123fgh#%$'
        }),

        await expect(() =>
        sut.execute({
                name: 'Carlos Souza',
                email,
                password: '123fgh#%$'
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExists);
    });
});