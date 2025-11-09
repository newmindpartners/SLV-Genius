import {injectable, singleton} from 'tsyringe';

import {EventStreamProjection} from '~/domain/events';

@singleton()
@injectable()
export class NoOpProjection implements EventStreamProjection {
  async handleWriteProjection(): Promise<void> {}
}
