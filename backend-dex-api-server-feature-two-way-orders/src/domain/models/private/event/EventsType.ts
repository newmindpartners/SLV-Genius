import * as Public from '~/domain/models/public';

// Why is there a public type defined in private types?
export type EventsType = Public.SignedTransaction['eventType'];
