import '@testing-library/jest-dom/extend-expect';
import { fetch, Headers, Request, Response } from 'cross-fetch';

// Source:
// https://github.com/reduxjs/redux-toolkit/issues/1271#issuecomment-877526770
global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;
