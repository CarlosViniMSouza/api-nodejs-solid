import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetUserProfileUseCase } from './get-user-profile';
import { ResourceNotFound } from './errors/resource-not-found';
import { MemoryUsersRepository } from '@/repositories/memory/memory-users-repository';

let usersRepository: MemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case Tests', () => {
    beforeEach(() => {
        usersRepository = new MemoryUsersRepository();
        sut = new GetUserProfileUseCase(usersRepository);
    });

    it('user should be able to get user profile', async () => {
        const createdUser = await usersRepository.create({
            name: 'Carlos Vinicius',
            email: 'vinisouza1055@email.com',
            password_hash: await hash('123fgh#%$', 4),
        });

        const { user } =  await sut.execute({
            userId: createdUser.id,
        });

        // expect(user.id).toEqual(expect.any(String));
        expect(user.name).toEqual('Carlos Vinicius');
    });

    it('user not should be able to get user profile with wrong id', async () => {
        expect(() =>
            sut.execute({
                userId: 'User Not Exist',
            })
        ).rejects.toBeInstanceOf(ResourceNotFound);
    });
});