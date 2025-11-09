## Prisma client

- Generate Prisma client

```shell
$  yarn prisma generate
```

NOTE: Be aware that switching between branches may require re-generating the client due to changes being made in schema.

The client lives in the node_modules on the host machine and so cannot be resolved with an image rebuild.

[More info about prisma client](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client)
