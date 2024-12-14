import { describe, expect, it, } from 'bun:test';

import app from "../index";

const mockRequest = async (url: RequestInfo | URL, options = {}) => {
  const response = await app.fetch(new Request(url, options));
  return response;
};

describe('User route endpoints', () => {
  it('should get all users', async () => {
    const response = await mockRequest('http://localhost:7676/user');
    expect(response.status).toBe(200);
  });

  it('should create a new user', async () => {
    const testEmail = `test${Date.now()}@example.com`;
    const response = await mockRequest('http://localhost:7676/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testEmail
      })
    });

    expect(response.status).toBe(201);

    const message = await response.json();
    expect(message).toBe(`User ${testEmail} created.`);
  });
});
