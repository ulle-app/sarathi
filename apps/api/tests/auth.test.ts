import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../src/app';
import { User } from '../src/models/User';
import { RefreshToken } from '../src/models/RefreshToken';

const app = createApp();

describe('Authentication Integration Tests', () => {
    const testUser = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
    };

    beforeAll(async () => {
        // Connect to test database or mock
        // Assuming DB is already connected via app.ts if MONGODB_URI is present
        await User.deleteMany({ email: testUser.email.toLowerCase() });
    });

    afterAll(async () => {
        await User.deleteMany({ email: testUser.email.toLowerCase() });
        await RefreshToken.deleteMany({});
    });

    describe('POST /api/v1/auth/register', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(testUser);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe(testUser.email.toLowerCase());
            expect(response.body.data.accessToken).toBeDefined();
            expect(response.headers['set-cookie']).toBeDefined();
        });

        it('should return 409 for duplicate email', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(testUser);

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
        });

        it('should return 400 for invalid email', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({ ...testUser, email: 'invalid-email' });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should login successfully with correct credentials', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.accessToken).toBeDefined();
            expect(response.headers['set-cookie']).toBeDefined();
        });

        it('should return 401 for incorrect password', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword',
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/auth/refresh', () => {
        it('should refresh access token using refresh token in cookie', async () => {
            // First login to get a cookie
            const loginRes = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                });

            const refreshTokenCookie = loginRes.headers['set-cookie'][0];

            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .set('Cookie', [refreshTokenCookie]);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.accessToken).toBeDefined();
        });
    });

    describe('POST /api/v1/auth/logout', () => {
        it('should logout successfully', async () => {
            const loginRes = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                });

            const accessToken = loginRes.body.data.accessToken;
            const refreshTokenCookie = loginRes.headers['set-cookie'][0];

            const response = await request(app)
                .post('/api/v1/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', [refreshTokenCookie]);

            expect(response.status).toBe(200);
            expect(response.headers['set-cookie']).toBeDefined();
            // Cookie should be cleared (max-age=0)
        });
    });
});
