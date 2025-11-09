import 'reflect-metadata';

import {container} from '~/server.dependencyContext';

import {CliToolsApplication} from './application';

container.register('CliToolsApplication', CliToolsApplication);

export * from '~/server.dependencyContext';
