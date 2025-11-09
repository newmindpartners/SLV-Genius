import {keyBy} from 'lodash';

import {Prisma} from '@prisma/client';

export type Asset = Prisma.AssetGetPayload<{}>;

export type AssetsMap = {[assetId: string]: Asset};

export const toAssetsMap = (assets: Asset[]): AssetsMap =>
  keyBy(assets, 'assetId');
