import {Project} from '~/domain/models/private';
// eslint-disable-next-line node/no-unpublished-import
import {createMock} from 'ts-auto-mock';

export const mockProject = (projectInput: Partial<Project>): Project => ({
  ...createMock<Project>(),
  ...projectInput,
});
