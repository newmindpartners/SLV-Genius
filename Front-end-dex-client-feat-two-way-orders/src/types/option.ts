import { ReactNode } from 'react';

export interface IOption<T extends string | number> {
  value: T;
  label: string;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
}
