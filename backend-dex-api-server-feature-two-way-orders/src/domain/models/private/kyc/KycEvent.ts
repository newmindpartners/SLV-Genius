import {KycSumsubEvent} from '~/domain/models/public';
import {KycProvider} from '~/domain/models/private';

export type KycEvent = {
  event: KycSumsubEvent;
  provider: KycProvider;
};
