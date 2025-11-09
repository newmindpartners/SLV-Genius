import * as Seed from '..';

export type ProjectGroupExports = {
  assets: {[s: string]: Seed.Asset};
  project: Seed.Project;
};

export const isProjectGroupExports = (
  fileImport: unknown
): fileImport is ProjectGroupExports => {
  if (typeof fileImport === 'object' && fileImport !== null) {
    const requiredKeys = ['assets', 'project'] as const;
    return requiredKeys.every(key => key in fileImport);
  }
  return false;
};
