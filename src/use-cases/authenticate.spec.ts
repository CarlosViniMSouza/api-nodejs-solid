import { hash } from 'bcryptjs';
import { describe, expect, it } from 'vitest';
import { MemoryUsersRepository } from '@/repositories/memory/memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

describe('Authenticate Use Case Tests', () => {
    it('user should be able to authenticate', async () => {
        const usersRepository = new MemoryUsersRepository();
        const sut = new AuthenticateUseCase(usersRepository);

        await usersRepository.create({
            name: 'Carlos Vinicius',
            email: 'vinisouza1055@email.com',
            password_hash: await hash('123fgh#%$', 4),
        });

        const { user } =  await sut.execute({
            email: 'vinisouza1055@email.com',
            password: '123fgh#%$'
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('user not should be able to authenticate with wrong email', async () => {
        const usersRepository = new MemoryUsersRepository();
        const sut = new AuthenticateUseCase(usersRepository);

        expect(() =>
            sut.execute({
                email: 'vinisouza1055@email.com',
                password: '123fgh#%$',
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('user not should be able to authenticate with wrong password', async () => {
        const usersRepository = new MemoryUsersRepository();
        const sut = new AuthenticateUseCase(usersRepository);

        await usersRepository.create({
            name: 'Carlos Vinicius',
            email: 'vinisouza1055@email.com',
            password_hash: await hash('123fgh#%$', 4),
        });

        expect(() =>
            sut.execute({
                email: 'vinisouza1055@email.com',
                password: '123fgh#%$890',
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});