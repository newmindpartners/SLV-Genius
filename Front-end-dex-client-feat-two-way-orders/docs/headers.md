# Server Response Headers Documentation

This document outlines the purpose of each response header used in the server configuration and provides guidance on updating the Content-Security-Policy for new third-party APIs.

## Headers Explanation

- `X-Powered-By`: Hides information about the technology stack used by the server to prevent targeted attacks.

- `Strict-Transport-Security`: Enforces secure (HTTPS) connections to the server for a set period, including on all subdomains.

- `X-Content-Type-Options`: Prevents the browser from interpreting files as a different MIME type to what is specified in the Content-Type header (MIME sniffing).

- `X-Frame-Options`: Protects against clickjacking by restricting who can embed the pages in iframes; `SAMEORIGIN` means only the same origin can frame the content.

- `Referrer-Policy`: Controls the amount of referrer information sent with requests, `no-referrer` means no referrer information will be sent.

- `X-XSS-Protection`: Enables cross-site scripting (XSS) filter in the browser and configures it to block detected attacks.

- `Content-Security-Policy`: Defines approved sources of content that browsers are allowed to load on the website. This is an essential security feature to prevent XSS attacks.

- `Cross-Origin-Opener-Policy`: Prevents other domains from sharing the same process with the page, improving security isolation.

- `Cross-Origin-Resource-Policy`: Allows the server to control which origins are allowed to load its resources.

## Content-Security-Policy (CSP)

The `Content-Security-Policy` is a complex header that controls which resources the browser is allowed to load for the page. It is essential for preventing a wide range of attacks, including Cross-site scripting and data injection.

### Allowed Origins

The CSP includes several directives, each with its own set of allowed origins:

- `default-src`: Limits fetching of all content types to the specified origins.
- `script-src`: Defines valid sources for JavaScript.
- `style-src`: Defines valid sources for stylesheets.
- `img-src`: Defines valid sources for images.
- `connect-src`: Defines valid sources for XMLHttpRequest, WebSocket, and EventSource.
- `font-src`: Defines valid sources for fonts.
- `frame-src`: Defines valid sources for frames.
- `object-src`: Defines valid sources for plugins, like `<object>`, `<embed>`, or `<applet>`.

For instance, `*.api.geniusyield.co` is an allowed origin for script, style, image, connection, font, and frame sources.

### Instructions for Adding a New Third-Party API

When integrating a new third-party API, follow these steps to update the CSP in the `serve.json` file:

1. Identify the content type(s) that the API will serve (e.g., script, style, image, etc.).
2. Add the domain of the third-party API to the appropriate source list in the CSP directive.
3. If the API requires inline scripts or styles, you may need to add `'unsafe-inline'` to `script-src` or `style-src`, respectively. Note that this can weaken your CSP.
4. For connecting to the API using web sockets or fetching data, add the API's domain to the `connect-src` directive.
5. Test the CSP changes locally by using `yarn build` and upping the defined Dockerfile.
