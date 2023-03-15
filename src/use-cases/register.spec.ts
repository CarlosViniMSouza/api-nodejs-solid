import { compare } from 'bcryptjs';
import { describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register';
import { UserAlreadyExists } from './errors/user-already-exists';
import { MemoryUsersRepository } from '@/repositories/memory/memory-users-repository';

describe('Register Use Case Tests', () => {
    it('should be able to register', async () => {
        const usersRepository = new MemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(usersRepository);

        const { user } =  await registerUseCase.execute({
            name: 'Carlos Souza',
            email: 'vinisouza1055@email.com',
            password: '123fgh#%$'
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('should hash user password after register', async () => {
        const usersRepository = new MemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(usersRepository);

        const { user } =  await registerUseCase.execute({
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
        const usersRepository = new MemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(usersRepository);
        const email = 'vinisouza1055@email.com';

        await registerUseCase.execute({
            name: 'Carlos Souza',
            email,
            password: '123fgh#%$'
        }),

        expect(() =>
            registerUseCase.execute({
                name: 'Carlos Souza',
                email,
                password: '123fgh#%$'
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExists);
    });
});