import { describe, expect, it } from 'bun:test';

import { appInstance } from '..';

const mockRequest = async (url: RequestInfo | URL, options = {}) => {
  const response = await appInstance.fetch(new Request(url, options));
  return response;
};

describe('Hono Application', () => {
  it('should return Hello Hono! for GET /', async () => {
    const response = await mockRequest('http://localhost:7676/');
    const text = await response.text();

    expect(response.status).toBe(200);
    expect(text).toBe('Hello Hono!');
  });
});
