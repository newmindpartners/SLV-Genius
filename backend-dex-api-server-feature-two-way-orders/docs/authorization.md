# Dex api authorization system

## Concepts

### Authorization checks

An authorization check is an object which contains a predicate function which determines `either` functor left or right behavior. The object includes an error message to use in the case that the `left` case is present. It also includes a `requestContextBuilder` which is an array of context builders which when provided a request are able to build the context required for the predicate.

```typescript
export interface AuthorizationCheck<T> {
  errorCode: string;
  predicate: (arg: T) => boolean;
  requestContextBuilder: ContextBuilder[];
}
```

A specific instance is project domain aware.

#### Error code

A simple string code to return in the case of an authorization failure to give context to the failure.

#### Predicate

A predicate function which accepts some context and returns a boolean value. These predicates must remain pure! NO side effects allowed. If side effects are required either perform them before hand in the context builders or after via IO functors.

#### Context builders

`src/implementation/authorization/project/context.builders.ts`

A context builder is responsible housing and executing side effects required to build / retrieve data required (context) to perform the authorization check.

### Composed rules

`src/implementation/authorization/user/rules.ts`
`src/implementation/authorization/project/authorizationChecks.ts`

- Comprises of many authorization checks.
- In the case of rounds the rule is specified on the round record.

A specific instance is project domain aware.

### Route authorization hook

`src/implementation/fastify/hook/authorization.ts`

AuthorizationHook is a fastify request middle hook which orchestrates: resolving dynamic authorization checks, building of context and finally determining validation.

Completely agnostic to project domain, only concerned with authorization system, but is fastify aware.

### Dynamic authorization check resolvers

`src/implementation/authorization/project/dynamicAuthorizationCheckResolver.ts`

A dynamic authorization check resolver is a function which when provided a request will use data in the request to determine an array of authorization checks which need to be performed.

```typescript
export type AuthorizationCheckResolver = (
  req: FastifyRequest
) => Promise<AuthorizationCheckTypes[]>;
```

Is project domain aware and is fastify aware.

### Validate functions

fp-ts either - `https://gcanti.github.io/fp-ts/modules/Either.ts.html`

`src/implementation/authorization/eitherUtils.ts`

Monadic either composition which resolves authorization checks down to all passed or which failed.

Completely agnostic to project domain, only concerned with authorization system.
