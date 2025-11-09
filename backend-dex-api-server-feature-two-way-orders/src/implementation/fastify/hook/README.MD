## Fastify Route Authorization Hook

```typescript
import {authorizationHook} from '~/implementation/fastify/hook/authorization';
import {isUserPresent} from '~/implementation/authorization/user/authorizationChecks';

// ...

fastify.route({
  method: 'POST',
  url: '/user/connect',
  preHandler: authorizationHook([isUserPresent]),
  handler: userMutation.postUserConnect.bind(userMutation),
});
```
