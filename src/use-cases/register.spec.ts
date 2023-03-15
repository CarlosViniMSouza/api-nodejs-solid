import { compare } from 'bcryptjs';
import { test, expect, it } from 'vitest';
import { RegisterUseCase } from './register';

test('test example', () => {
    it('should hash user password after register', async () => {
        // const prismaUsersRepository = new PrismaUsersRepository();
        const registerUseCase = new RegisterUseCase({
            async findByEmail(email) {
                return null;
            },

            async create(data) {
                return {
                    id: 'id01',
                    name: data.name,
                    email: data.email,
                    password_hash: data.password_hash,
                    created_at: new Date(),
                }
            }
        });

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
});