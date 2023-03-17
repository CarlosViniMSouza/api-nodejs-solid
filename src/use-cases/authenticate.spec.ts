import { hash } from 'bcryptjs';
import { AuthenticateUseCase } from './authenticate';
import { beforeEach, describe, expect, it } from 'vitest';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { MemoryUsersRepository } from '@/repositories/memory/memory-users-repository';

let usersRepository: MemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case Tests', () => {
    beforeEach(() => {
        usersRepository = new MemoryUsersRepository();
        sut = new AuthenticateUseCase(usersRepository);
    });

    it('user should be able to authenticate', async () => {
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
        expect(() =>
            sut.execute({
                email: 'vinisouza1055@email.com',
                password: '123fgh#%$',
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('user not should be able to authenticate with wrong password', async () => {
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