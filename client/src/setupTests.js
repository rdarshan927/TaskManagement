import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { Response, Request, Headers, fetch } from 'node-fetch';

// Node.js polyfills
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.Response = Response;
global.Request = Request;
global.Headers = Headers;
global.fetch = fetch;

// Mock for TransformStream
global.TransformStream = class MockTransformStream {};

// Mock for BroadcastChannel
global.BroadcastChannel = class MockBroadcastChannel {
  constructor() {}
  postMessage() {}
  close() {}
};

// Additional window objects
global.window = {
  ...global.window,
  URL: {
    createObjectURL: jest.fn(),
    revokeObjectURL: jest.fn(),
  },
};