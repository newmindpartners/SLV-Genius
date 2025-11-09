import {FastifyHelmetOptions} from '@fastify/helmet';

/**
 * The goal of these headers are to improve security and
 * to maximise the score recorded at https://securityheaders.com/
 * This configuration aims to achieve a score of at least A
 * Initial requirements were captured in this ticket
 * https://github.com/geniusyield/website-x/issues/111
 */
export const fastifyHelmetConfig: FastifyHelmetOptions = {
  // refer https://helmetjs.github.io/ for documentation of headers
  global: true,

  // Simple middleware to remove the X-Powered-By HTTP header if it's set.
  // Hackers can exploit known vulnerabilities in Express/Node if they see that your site is powered by Express (or whichever framework you use)
  hidePoweredBy: true,

  // Strict-Transport-Security : HTTP Strict Transport Security is an excellent feature to support on your site and strengthens your implementation of TLS by getting the User Agent to enforce the use of HTTPS.
  // Recommended value "Strict-Transport-Security: max-age=31536000; includeSubDomains".
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },

  // Sets the X-Content-Type-Options header to nosniff.
  // This mitigates MIME type sniffing which can cause security vulnerabilities
  noSniff: true,

  // Sets the X-Frame-Options header to help you mitigate clickjacking attacks
  frameguard: {
    action: 'deny',
  },

  // Specifies that no referrer information is to be sent along with requests made from a particular request client to any origin
  referrerPolicy: {
    policy: 'no-referrer',
  },

  // Disables browsers' buggy cross-site scripting filter by setting the X-XSS-Protection header to 0
  xssFilter: true,

  // Cross-Origin Embedder Policy allows a site to prevent assets being loaded that do not grant permission to load them via CORS or CORP.
  crossOriginEmbedderPolicy: false,

  // Allows a site to opt-in to Cross-Origin Isolation in the browser.
  crossOriginOpenerPolicy: true,

  // Allows a resource owner to specify who can load the resource.
  crossOriginResourcePolicy: true,

  // Csp an effective measure to protect your site from XSS attacks. By whitelisting sources of approved content, you can prevent the browser from loading malicious assets.
  // The "unsafe-inline" and googletagmanager links enable gtm to bypass csp
  // Here we only approve gtm our required fonts and self data
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'www.googletagmanager.com'],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://www.googletagmanager.com',
      ],
    },
  },
};
