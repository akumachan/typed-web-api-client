import { ApiClient, HttpResponse } from './api-client'

jest.mock('axios')
import axios, { AxiosInstance } from 'axios'

const mockAxios: jest.Mocked<AxiosInstance> = axios as any;

type ExpectedResponse = { 
  url: string;
  method: string;
  message?: string;
  common?: string;
}

type TestScheme = {
  '/test': {
    'GET': {
      parameters: {
        message: string
      };
      response: ExpectedResponse; 
    };
    'POST': {
      parameters: {
        message: string
      };
      response: ExpectedResponse;
    };
  }
}

const serviceWithCommon = new ApiClient('https://example.com', { common: 'Common' }).service<TestScheme>()
const serviceWithoutCommon = new ApiClient('https://example.com').service<TestScheme>()

describe('Get method', () => {

  mockAxios.get.mockImplementation((url: string) => Promise.resolve( 
    { 
      status: 200,
      statusText: 'OK',
      data: { 
        url,
        method: 'GET',
      } 
    }
  ))

  test('should succeed with common parameters.', () => {

    expect.assertions(1)

    const expected: HttpResponse<ExpectedResponse> = {
      status: 200,
      statusText: 'OK',
      data: {
        url: 'https://example.com/test?message=Get+w%2F+common.&common=Common',
        method: 'GET',
      }
    }

    return expect(serviceWithCommon.call('/test', 'GET', { message: 'Get w/ common.' })).resolves.toEqual(expected)
  })

  test('should succeed without common parameters.', () => {

    expect.assertions(1)

    const expected: HttpResponse<ExpectedResponse> = {
      status: 200,
      statusText: 'OK',
      data: {
        url: 'https://example.com/test?message=Get+w%2Fo+common.',
        method: 'GET',
      }
    }

    return expect(serviceWithoutCommon.call('/test', 'GET', { message: 'Get w/o common.' })).resolves.toEqual(expected)
  })
})

describe('Post method', () => {

  mockAxios.post.mockImplementation((url: string, parameters: {}) =>  Promise.resolve(
    { 
      status: 200, 
      statusText: 'OK', 
      data: {
        url, 
        method: 'POST',
        message: new URLSearchParams(parameters).toString()
      } 
    }
  ))

  test('should succeed with common parameters.', async () => {

    expect.assertions(1)

    const expected: HttpResponse<ExpectedResponse> = {
      status: 200,
      statusText: 'OK',
      data: {
        url: 'https://example.com/test',
        method: 'POST',
        message: 'message=Post+w%2F+common.&common=Common',
      }
    }

    return expect(serviceWithCommon.call('/test', 'POST', { message: 'Post w/ common.' })).resolves.toEqual(expected)
  })

  test('should succeed without common parameters.', async () => {

    expect.assertions(1)

    const expected: HttpResponse<ExpectedResponse> = {
      status: 200,
      statusText: 'OK',
      data: {
        url: 'https://example.com/test',
        method: 'POST',
        message: 'message=Post+w%2Fo+common.',
      }
    }

    return expect(serviceWithoutCommon.call('/test', 'POST', { message: 'Post w/o common.' })).resolves.toEqual(expected)
  })
})