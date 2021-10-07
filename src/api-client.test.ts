import { ApiClient, HttpResponse } from './api-client'

jest.mock('axios')
import axios, { AxiosInstance } from 'axios'

const mockAxios: jest.Mocked<AxiosInstance> = axios as any;
mockAxios.get.mockImplementation((url: string) => 
  Promise.resolve( 
    { 
      status: 200,
      statusText: 'OK',
      data: { 
        url,
        method: 'GET',
      } 
    }))
mockAxios.post.mockImplementation(
  (url: string, parameters: { message: string }) =>  
    Promise.resolve(
      { 
        status: 200, 
        statusText: 'OK', 
        data: {
          url, 
          method: 'POST',
          message: parameters.message,
        } 
      }
    ))

type ExpectedResponse = { 
  url: string;
  method: string;
  message?: string;
}

type TestScheme = {
  [path in typeof testPath]: {
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
    'PUT': {
      parameters: {
        message: string
      };
      response: ExpectedResponse;
    }
    'DELETE': {
      parameters: {
        message: string
      };
      response: ExpectedResponse;
    }
  }
}

const testUrl = 'http://example.com'
const testPath = '/test'
const testQuery = (method: string) => method === 'GET' ? `?message=${testMessage}` : ''
const testMessage = 'TestMessage'
const expectedData = (method: string) => ({
  url: testUrl + testPath + testQuery(method),
  message: method === 'GET' ? undefined : testMessage,
  method
})
const client = new ApiClient(testUrl)
const service = client.service<TestScheme>()

describe('Get method', () => {
  test('should succeeded.', () => {
    const expected: HttpResponse<ExpectedResponse> = {
      status: 200,
      statusText: 'OK',
      data: expectedData('GET')
    }
    expect.assertions(1)
    return expect(service.call('/test', 'GET', { message: testMessage }))
      .resolves.toEqual(expected)
  })
})
describe('Post method', () => {
  test('should succeed.', async () => {
    const expected: HttpResponse<ExpectedResponse> = {
      status: 200,
      statusText: 'OK',
      data: expectedData('POST')
    }
    expect.assertions(1)
    const actual = expect(service.call('/test', 'POST', { message: testMessage }))

    actual.resolves.toEqual(expected)
  })
})