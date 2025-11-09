import {AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {LoggerService} from '~/domain/services';

export function curl<T>(baseURL: string, path: string, payload: T) {
  return [
    "curl -X POST -H 'Content-Type: application/json'",
    `${baseURL}${path}`,
    `-d '${payload}'`,
  ].join(' ');
}

export function requestStartTime(config: InternalAxiosRequestConfig) {
  config.headers['request-start'] = new Date().getTime();
  return config;
}

export function responseEndTime(
  loggerService: LoggerService,
  logPrefix: string
) {
  return (response: AxiosResponse<any>) => {
    const {
      config: {headers, url},
    } = response;
    const startTime = headers['request-start'];
    const endTime = new Date().getTime();
    const duration = (endTime - startTime) / 1000;
    loggerService.info(
      `${logPrefix} url: <${url}>, requestTime: <${duration}> seconds`
    );
    return response;
  };
}

export function logRequest(loggerService: LoggerService) {
  return (config: InternalAxiosRequestConfig) => {
    const {baseURL, url, data} = config;
    if (baseURL && url && data) {
      loggerService.info(curl(baseURL, url, data));
    }
    return config;
  };
}
