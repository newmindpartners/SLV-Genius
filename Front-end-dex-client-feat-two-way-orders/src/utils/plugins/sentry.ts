import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import React from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { environments } from '~/utils/envVar';

const envSentryEnvironment = import.meta.env.VITE_SENTRY_ENVIRONMENT;

export const SENTRY_ENVIRONMENT_NAME = envSentryEnvironment
  ? envSentryEnvironment
  : environments.dev;

export const SENTRY_DATASOURCE_NAME =
  'https://a6cfd9a81b6646caaf6d4e83e87c5dd5@o1376840.ingest.sentry.io/4504322150301696';
export const SENTRY_NORMALIZE_DEPTH = 10;
export const SENTRY_TRACES_SAMPLE_RATE = 0.2;

export const init = () => {
  Sentry.init({
    // Set data source name
    dsn: SENTRY_DATASOURCE_NAME,

    // Set environment name to distinguish issue in different environments, eg development, production
    environment: SENTRY_ENVIRONMENT_NAME,

    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes,
        ),
      }),
    ],

    // Set tracesSampleRate to specify the percentage of transactions to capture.
    tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,

    // Redux state context depth
    normalizeDepth: SENTRY_NORMALIZE_DEPTH,

    // Identifier used to relate reported errors to a Sentry release
    release: process.env.SENTRY_RELEASE,
  });
};
