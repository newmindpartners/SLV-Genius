import {AuthorizationCheck} from '../types';

import {
  entityEventExistsContextBuilderFactory,
  EventExistsContext,
} from './context.builders';

export const isEventPresent: AuthorizationCheck<EventExistsContext> = {
  errorCode: 'TX_SUBMIT_EVENT_NOT_PRESENT',
  predicate: ({isEventPresent}: EventExistsContext) => isEventPresent,
  requestContextBuilder: [entityEventExistsContextBuilderFactory],
};
