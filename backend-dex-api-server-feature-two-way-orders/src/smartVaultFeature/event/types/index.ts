import {pick} from 'lodash';

import {DomainEvent, EventType, EventTypes} from '~/domain/events';
import {getKeys} from '~/domain/utils/typescript.util';
import {ExtractBySubstring} from '~/implementation/utils/typescript';

import {SmartVaultOpenEvent} from './OpenEvent';
import {SmartVaultDepositEvent} from './DepositEvent';
import {SmartVaultCloseEvent} from './CloseEvent';
import {SmartVaultWithdrawEvent} from './WithdrawEvent';

export type SmartVaultEvent =
  | SmartVaultOpenEvent
  | SmartVaultDepositEvent
  | SmartVaultWithdrawEvent
  | SmartVaultCloseEvent;

export const SMART_VAULT_IDENTIFIER = 'SMART_VAULT';

export type SmartVaultEventType = ExtractBySubstring<
  EventType,
  typeof SMART_VAULT_IDENTIFIER
>;

const isSmartVaultEventType = (
  eventType: EventType
): eventType is SmartVaultEventType =>
  eventType.includes(SMART_VAULT_IDENTIFIER);

export const SmartVaultEventTypesArray: SmartVaultEventType[] = getKeys(
  EventTypes
).filter(isSmartVaultEventType);

export const SmartVaultEventTypes = pick(EventTypes, SmartVaultEventTypesArray);

export const isSmartVaultEvent = (
  event: DomainEvent
): event is SmartVaultEvent => {
  return event.eventType.includes(SMART_VAULT_IDENTIFIER);
};

export const SmartVaultEventVersions = {
  [EventTypes.SMART_VAULT__OPEN_INIT__REQUEST]: 1,
  [EventTypes.SMART_VAULT__OPEN_INIT__FAILURE]: 1,
  [EventTypes.SMART_VAULT__OPEN_INIT__SUCCESS]: 1,
  [EventTypes.SMART_VAULT__OPEN_SUBMIT__SUCCESS]: 1,
  [EventTypes.SMART_VAULT__OPEN_SUBMIT__FAILURE]: 1,
  [EventTypes.SMART_VAULT__OPEN_ONCHAIN__SUCCESS]: 1,
  [EventTypes.SMART_VAULT__OPEN_ONCHAIN__FAILURE]: 1,
  [EventTypes.SMART_VAULT__DEPOSIT_INIT__REQUEST]: 1,
  [EventTypes.SMART_VAULT__DEPOSIT_INIT__FAILURE]: 1,
  [EventTypes.SMART_VAULT__DEPOSIT_INIT__SUCCESS]: 1,
  [EventTypes.SMART_VAULT__DEPOSIT_SUBMIT__SUCCESS]: 1,
  [EventTypes.SMART_VAULT__DEPOSIT_SUBMIT__FAILURE]: 1,
  [EventTypes.SMART_VAULT__DEPOSIT_ONCHAIN__SUCCESS]: 1,
  [EventTypes.SMART_VAULT__DEPOSIT_ONCHAIN__FAILURE]: 1,
  [EventTypes.SMART_VAULT__WITHDRAW_INIT__REQUEST]: 1,
  [EventTypes.SMART_VAULT__WITHDRAW_INIT__FAILURE]: 1,
  [EventTypes.SMART_VAULT__WITHDRAW_INIT__SUCCESS]: 1,
  [EventTypes.SMART_VAULT__WITHDRAW_SUBMIT__SUCCESS]: 1,
  [EventTypes.SMART_VAULT__WITHDRAW_SUBMIT__FAILURE]: 1,
  [EventTypes.SMART_VAULT__WITHDRAW_ONCHAIN__SUCCESS]: 1,
  [EventTypes.SMART_VAULT__WITHDRAW_ONCHAIN__FAILURE]: 1,
  [EventTypes.SMART_VAULT__CLOSE_INIT__REQUEST]: 1,
  [EventTypes.SMART_VAULT__CLOSE_INIT__FAILURE]: 1,
  [EventTypes.SMART_VAULT__CLOSE_INIT__SUCCESS]: 1,
  [EventTypes.SMART_VAULT__CLOSE_SUBMIT__SUCCESS]: 1,
  [EventTypes.SMART_VAULT__CLOSE_SUBMIT__FAILURE]: 1,
  [EventTypes.SMART_VAULT__CLOSE_ONCHAIN__SUCCESS]: 1,
  [EventTypes.SMART_VAULT__CLOSE_ONCHAIN__FAILURE]: 1,
} as const;

export type SmartVaultEventVersion = typeof SmartVaultEventVersions;
