export enum environments {
  dev = 'development',
  prod = 'production',
  test = 'test',
}

export enum hostnames {
  dev = 'dev.app.geniusyield.co',
  prod = 'app.geniusyield.co',
  test = 'testnet.geniusyield.co',
  local = 'localhost',
}

export const isEnv = (target: environments): boolean => process.env.NODE_ENV === target;

export const isHostname = (target: hostnames[]): boolean =>
  target.includes(window.location.hostname as hostnames);
