/**
 * Genius Yield DEX Core API
 * 1.0.0
 * DO NOT MODIFY - This file has been generated using oazapfts.
 * See https://www.npmjs.com/package/oazapfts
 */
import * as Oazapfts from "oazapfts/lib/runtime";
import * as QS from "oazapfts/lib/runtime/query";
export const defaults: Oazapfts.RequestOpts = {
    baseUrl: "https://api.geniusyield.co",
};
const oazapfts = Oazapfts.runtime(defaults);
export const servers = {
    production: "https://api.geniusyield.co",
    testing: "https://dev.api.geniusyield.co",
    local: "http://localhost:8012"
};
export type CirculatingSupply = {
    circulatingSupply: string;
};
export type AbstractError = {
    errorCode: string;
    message?: string;
};
export type GeneralError = AbstractError;
export type OrderSaleProjectRoundStatus = "UPCOMING" | "ACTIVE" | "CLOSED";
export type OrderSaleProjectReference = {
    orderSaleProjectId: string;
};
export type BaseAssetAmount = {
    baseAssetAmount: string;
};
export type QuoteAssetAmount = {
    quoteAssetAmount: string;
};
export type AssetReference = {
    assetId: string;
};
export type Asset = AssetReference & {
    assetId: string;
    policyId: string;
    assetName: string;
    shortName: string;
    longName: string;
    iconUrl: string;
    decimalPrecision: number;
    referenceAssetId?: string;
    referenceAssetAmount?: string;
    enabled?: boolean;
};
export type AbstractOrderSaleProject = OrderSaleProjectReference & BaseAssetAmount & QuoteAssetAmount & {
    name: string;
    status: OrderSaleProjectRoundStatus;
    imageLogoUrl: string;
    longDescription: string;
    shortDescription: string;
    vestingPeriod: string;
    distributionDate: string;
    distributionMethod: string;
    baseAsset: Asset;
    quoteAsset: Asset;
    baseAssetAllocationAmount: string;
    baseAssetTotalTokenSupplyAmount?: string;
    roundsQuoteAssetRoundsRaisedAmount: string;
    roundsBaseAssetAllocationAmount: string;
    distributionIsCompleted: boolean;
    mediaEmail?: string;
    websiteUrl?: string;
    pitchDeckUrl?: string;
    whitePaperUrl?: string;
    mediaDiscordUrl?: string;
    mediaMediumUrl?: string;
    mediaTwitterUrl?: string;
    mediaTelegramUrl?: string;
    privacyPolicyUrl?: string;
    mediaYoutubeUrl?: string;
};
export type OrderSaleProjectRoundReference = {
    roundId: string;
};
export type BaseAssetReference = {
    baseAssetId: string;
};
export type QuoteAssetReference = {
    quoteAssetId: string;
};
export type OrderSaleProjectRound = OrderSaleProjectRoundReference & BaseAssetReference & BaseAssetAmount & QuoteAssetReference & QuoteAssetAmount & {
    orderSaleProjectId: string;
    "number": number;
    shortName: string;
    startDate: string;
    endDate: string;
    status: OrderSaleProjectRoundStatus;
    isClosed: boolean;
    isSoldOut: boolean;
    orderBaseAssetMinAllocation: string;
    orderBaseAssetMaxAllocation: string;
    quoteAssetRaisedAmount: string;
    baseAssetSubmittedAmount: string;
    baseAssetAllocationAmount: string;
    eligibilityDescription?: string | null;
};
export type ProjectTeamMemberReference = {
    teamMemberId: string;
};
export type ProjectTeamMember = ProjectTeamMemberReference & {
    name: string;
    role: string;
    imageUrl: string;
    twitterUrl?: string;
    telegramUrl?: string;
    linkedinUrl?: string;
    facebookUrl?: string;
};
export type KeyFeature = {
    title: string;
    description: string;
};
export type Technology = {
    iconUrl: string;
    title: string;
    subtitle: string;
    description: string;
};
export type TokenomicsItem = {
    title: string;
    amount: number;
};
export type OrderSaleProjectRoadmapItem = {
    title: string;
    roadmapObjectives: string[];
    isChecked: boolean;
};
export type OrderSaleProject = AbstractOrderSaleProject & {
    status: OrderSaleProjectRoundStatus;
    statusRoundId: string;
    isBuyForbidden: boolean;
    isBuyForbiddenReason?: string;
    rounds: OrderSaleProjectRound[];
    teamMembers?: ProjectTeamMember[] | null;
    fundingMethod?: string | null;
    lockupPeriod?: string | null;
    projectReportUrl?: string | null;
    tokenUtility?: {
        description?: string | null;
        items?: string[] | null;
    } | null;
    keyFeatures?: KeyFeature[] | null;
    technologies?: Technology[] | null;
    mediaYoutubeUrl?: string | null;
    tokenomics?: TokenomicsItem[] | null;
    roadmapItems?: OrderSaleProjectRoadmapItem[] | null;
};
export type OrderSaleProjectResults = {
    count: number;
    next?: string;
    previous?: string;
    results: OrderSaleProject[];
};
export type EntityCreated = {
    created: string;
};
export type EntityUpdated = {
    updated: string;
};
export type EntityDates = EntityCreated & EntityUpdated;
export type OrderReference = {
    orderId: string;
};
export type OrderStatus = string;
export type Transaction = {
    transactionId: string;
    transactionUrl: string;
};
export type TransactionType = string;
export type OrderTransaction = Transaction & {
    transactionDate?: string;
    transactionHash?: string;
    transactionType: TransactionType;
    isTransactionConfirmed: boolean;
};
export type SaleOrderBase = EntityDates & OrderReference & BaseAssetReference & BaseAssetAmount & QuoteAssetReference & QuoteAssetAmount & {
    status: OrderStatus;
    statusTransactionId: string;
    transactions: OrderTransaction[];
};
export type SaleOrderData = OrderSaleProjectRoundReference & BaseAssetReference & BaseAssetAmount;
export type SaleOrderStatus = OrderStatus & ("OPEN" | "FILL" | "CANCEL" | "PARTIAL_FILL");
export type SaleOrderTransactionType = TransactionType & ("OPEN" | "FILL" | "CANCEL");
export type SaleOrderTransaction = OrderTransaction & {
    transactionType: SaleOrderTransactionType;
};
export type SaleOrder = SaleOrderBase & SaleOrderData & {
    baseAssetAmountFilled: string;
    status: SaleOrderStatus;
    isStatusPending: boolean;
    transactions: SaleOrderTransaction[];
};
export type OrderSalePortfolioProject = OrderSaleProject & {
    orders: (SaleOrder)[];
};
export type OrderSalePortfolioResults = {
    count: number;
    next?: string;
    previous?: string;
    results: OrderSalePortfolioProject[];
};
export type SwapOrderSortByOptions = "+toAssetAmount" | "-toAssetAmount" | "+fromAssetAmount" | "-fromAssetAmount" | "+serviceFee" | "-serviceFee" | "+created" | "-created";
export type SwapOrderStatus = OrderStatus & ("PENDING" | "OPEN" | "FAILED" | "FILLED" | "CANCELLED" | "SCHEDULED" | "EXPIRED" | "OPEN_INIT" | "OPEN_SUBMIT" | "OPEN_ONCHAIN" | "FILL_INIT" | "FILL_SUBMIT" | "FILL_ONCHAIN");
export type SwapOrderType = "LIMIT";
export type SwapOrderFillType = "FILL_DIRECT" | "FILL_BEST_AVAILABLE";
export type ToAssetReference = {
    toAssetId: string;
};
export type ToAssetAmount = {
    toAssetAmount: string;
};
export type FromAssetReference = {
    fromAssetId: string;
};
export type FromAssetAmount = {
    fromAssetAmount: string;
};
export type Order = EntityDates & OrderReference & ToAssetReference & ToAssetAmount & FromAssetReference & FromAssetAmount & {
    status: OrderStatus;
    statusTransactionId: string;
    transactions: OrderTransaction[];
};
export type FillFromAssetCount = {
    fillFromAssetCount?: string;
};
export type EffectiveDates = {
    effectiveFromDate?: string;
    effectiveUntilDate?: string;
};
export type SwapOrderData = ToAssetReference & ToAssetAmount & FromAssetReference & FromAssetAmount & FillFromAssetCount & EffectiveDates & {
    orderType: SwapOrderType | SwapOrderFillType;
};
export type SwapOrderAssetPair = {
    toAsset: Asset;
    fromAsset: Asset;
};
export type MinFillFromAssetAmount = {
    minFillFromAssetAmount?: string;
};
export type MinFillToAssetAmount = {
    minFillToAssetAmount?: string;
};
export type SwapOrderAmountFilled = {
    toAssetAmountFilled: string;
    fromAssetAmountFilled: string;
};
export type SwapOrderAmountRemaining = {
    toAssetAmountRemaining: string;
    fromAssetAmountRemaining: string;
};
export type Deposit = {
    depositAmount?: string;
};
export type TransactionFee = {
    transactionFeeAmount?: string;
};
export type SwapOrderMakerFees = TransactionFee & {
    makerLovelaceFlatFeeAmount?: string;
    makerFromAssetFeeAmount?: string;
    makerFromAssetFeePercent?: string;
};
export type SwapOrderTakerFees = TransactionFee & {
    takerLovelaceFlatFeeAmount?: string;
    takerFromAssetFeeAmount?: string;
    takerFromAssetFeePercent?: string;
};
export type TransactionTotalFees = {
    transactionTotalFeesAmount: string;
};
export type SwapOrderTransactionType = TransactionType & ("OPEN" | "FILL" | "CANCEL" | "PARTIAL_FILL");
export type SwapOrderTransaction = OrderTransaction & {
    toAssetAmountFilled?: string | null;
    fromAssetAmountFilled?: string | null;
    transactionType: SwapOrderTransactionType;
};
export type SwapOrder = Order & SwapOrderData & SwapOrderAssetPair & MinFillFromAssetAmount & MinFillToAssetAmount & SwapOrderAmountFilled & SwapOrderAmountRemaining & Deposit & SwapOrderMakerFees & SwapOrderTakerFees & TransactionFee & TransactionTotalFees & {
    status: SwapOrderStatus;
    transactions: SwapOrderTransaction[];
};
export type SwapOrderResults = {
    count: number;
    next?: string;
    previous?: string;
    results: SwapOrder[];
};
export type NetworkErrorCode = "NETWORK__TIMEOUT";
export type TransactionErrorCode = "TRANSACTION__NO_SUITABLE_COLLATERAL";
export type OrderErrorCode = "INVALID_ORDER__INSUFFICIENT_BALANCE" | "INVALID_ORDER__ORDER_NOT_ACTIVE_OR_EXPIRED" | "ORDER__BEST_AVAILABLE_ORDER_NOT_FOUND" | "INVALID_ORDER__UTXO_CONSUMED";
export type OrderError = {
    errorCode: NetworkErrorCode | TransactionErrorCode | OrderErrorCode;
    message?: string;
};
export type MarketOrderSwapItem = {
    marketOrderSwap: SwapOrder;
    marketOrderSwapFillAmount: string;
};
export type MarketOrderSwapResults = {
    displayUnitPrice: string;
    displayUnitPriceAssetId: string;
    marketOrderSwapFilledAmount: string;
    marketOrderSwapTotalFillAmount: string;
    marketOrderFillAmountAssetId: string;
    marketOrderSwaps: MarketOrderSwapItem[];
};
export type BestAvailableSwapOrderResults = {
    marketOrderSwapResults: (MarketOrderSwapResults) | null;
    alternativeMarketOrderSwapResults: (MarketOrderSwapResults) | null;
};
export type WalletAddress = {
    walletAddress: string;
};
export type WalletAccount = WalletAddress & {
    walletRewardAddresses?: string[];
    walletUsedAddresses: string[];
    walletUnusedAddresses: string[];
    collateralUtxo: string[];
};
export type OpenSwapOrder = WalletAccount & SwapOrderData;
export type SwapOrderMakerDepositFees = Deposit & SwapOrderMakerFees;
export type SwapOrderMakerTotalFeesDeposit = SwapOrderMakerDepositFees & TransactionTotalFees;
export type SaleOrderErrorCode = "REQUEST_VALIDATION__MISSING_ROUND_ID" | "INVALID_ORDER__TOO_EARLY_PLACE" | "INVALID_ORDER__TOO_LATE_PLACE" | "REQUEST_VALIDATION__MISSING_ORDER_ID" | "INVALID_ORDER__INVALID_USER";
export type SaleOrderError = {
    errorCode: NetworkErrorCode | TransactionErrorCode | OrderErrorCode | SaleOrderErrorCode;
    message?: string;
};
export type UnsignedTransaction = {
    transactionId: string;
    transactionPayload: string;
};
export type OpenSaleOrder = SaleOrderData & WalletAccount;
export type SaleOrderTotalFeesDeposit = {
    transactionFeeAmount?: string;
    transactionFeeDepositAmount?: string;
    transactionFeeServiceAmount?: string;
    transactionFeeServicePercent?: string;
    transactionTotalCostsAmount?: string;
};
export type UnsignedSaleOrderData = SaleOrderData & QuoteAssetAmount & QuoteAssetReference & UnsignedTransaction;
export type UnsignedSaleOrder = OrderReference & UnsignedSaleOrderData;
export type CancelSwapOrder = WalletAccount;
export type FillSwapOrder = ToAssetAmount & {
    orderReference: OrderReference;
};
export type FillSwapOrders = WalletAccount & {
    fillSwapOrders: FillSwapOrder[];
    orderFillType: SwapOrderFillType;
};
export type SwapOrderTakerTotalFees = SwapOrderTakerFees & TransactionTotalFees;
export type CancelSaleOrder = WalletAccount;
export type SmartVaultReference = {
    smartVaultId: string;
};
export type SmartVaultStrategy = {
    created: string;
    smartVaultStrategyId: string;
    name: string;
    description: string;
    configJsonSchema: string;
    numberOfAssetsSupported: number;
};
export type SmartVaultAssetDetailed = {
    assetId: string;
    asset?: Asset;
    assetAmount: string;
};
export type SmartVault = SmartVaultReference & {
    status: "PENDING" | "OPEN" | "CLOSED" | "FAILED";
    stakeKeyHashRef: string;
    smartVaultStrategy: SmartVaultStrategy | null;
    depositedAssets: SmartVaultAssetDetailed[];
    withdrawableAssets: SmartVaultAssetDetailed[];
    created: string;
};
export type SmartVaultListResult = {
    count: number;
    next?: string;
    previous?: string;
    results: SmartVault[];
};
export type SmartVaultId = string;
export type SmartVaultResult = SmartVault;
export type SmartVaultOperationReference = {
    smartVaultOperationId: string;
};
export type SmartVaultOperation = SmartVaultReference & SmartVaultOperationReference & {
    operationType: "DEPOSIT" | "WITHDRAW";
    status: "PENDING" | "CONFIRMED" | "FAILED";
    creatorStakeKeyHash: string;
    transactionHash: string;
    transactionDate?: string;
    assets: SmartVaultAssetDetailed[];
};
export type SmartVaultOperationListResult = {
    count: number;
    next?: string;
    previous?: string;
    results: SmartVaultOperation[];
};
export type SmartVaultStrategyListResult = SmartVaultStrategy[];
export type SmartVaultAssetTransfer = {
    assetId: string;
    assetAmount: string;
};
export type SmartVaultOpenData = {
    smartVaultStrategyId: string;
    smartVaultStrategyConfigJson: string;
    depositAssets: SmartVaultAssetTransfer[];
};
export type SmartVaultOpen = WalletAccount & SmartVaultOpenData;
export type SmartVaultErrorCode = "SMART_VAULT__REQUEST_VALIDATION__HAS_DEPOSITED_ASSETS" | "INVALID_ORDER__UTXO_CONSUMED";
export type SmartVaultError = {
    errorCode: NetworkErrorCode | TransactionErrorCode | SmartVaultErrorCode;
    message?: string;
};
export type SmartVaultDepositData = SmartVaultReference & {
    depositAssets: SmartVaultAssetTransfer[];
};
export type SmartVaultDeposit = WalletAccount & SmartVaultDepositData;
export type SmartVaultWithdrawEstimateData = SmartVaultReference;
export type SmartVaultWithdrawEstimate = WalletAccount & SmartVaultWithdrawEstimateData;
export type SmartVaultWithdrawEstimateResult = {
    withdrawableAssets: SmartVaultAssetDetailed[];
};
export type SmartVaultWithdrawData = SmartVaultReference & {
    withdrawAssets: SmartVaultAssetTransfer[];
};
export type SmartVaultWithdraw = WalletAccount & SmartVaultWithdrawData;
export type SmartVaultCloseData = SmartVaultReference;
export type SmartVaultClose = WalletAccount & SmartVaultCloseData;
export type TradingPair = {
    tradingPairId: string;
    baseAsset: Asset;
    quoteAsset: Asset;
};
export type TradingPairsResults = {
    results: TradingPair[];
};
export type LiquidityPool = {
    liquidityPoolId?: string;
    assets?: Asset[];
};
export type LiquidityPoolsResults = {
    count: number;
    next?: string;
    previous?: string;
    results: LiquidityPool[];
};
export type LiquidityPoolReference = {
    liquidityPoolId: string;
};
export type LiquidityPositionStatus = "OPEN" | "CLOSE";
export type LiquidityPositionReference = {
    LiquidityPositionId: string;
};
export type WalletStakeKeyHash = {
    walletStakeKeyHash: string;
};
export type LiquidityPositionData = {
    toAssetId?: string;
    toInitialAmount?: string;
    fromAssetId?: string;
    fromInitialAmount?: string;
    fromPrice?: string;
    minTradePriceLimit?: string;
};
export type LiquidityPosition = LiquidityPositionReference & WalletStakeKeyHash & LiquidityPositionData;
export type OpenLiquidityPosition = WalletAccount & LiquidityPositionData;
export type UnsignedLiquidityPosition = LiquidityPosition & UnsignedTransaction;
export type LiquidityPositionClose = WalletAccount;
export type SignedTransaction = {
    transactionId: string;
    transactionPayload: string;
    transactionSignature: string;
    eventType: "orderSwapEvent" | "orderSaleEvent" | "stakeVaultEvent" | "yieldFarmingEvent" | "optionEvent" | "smartVaultEvent" | "twoWayOrderEvent";
};
export type TransactionSubmitSuccessResponse = {
    status: "SUBMITTED";
    transaction: Transaction;
};
export type TransactionSubmitAcceptedResponse = {
    status: "QUEUED" | "REJECTED";
};
export type OrderBookEntryType = "SwapOrder";
export type OrderBookEntry = {
    orderBookEntryType: OrderBookEntryType;
    order: SwapOrder;
};
export type OrderBook = BaseAssetReference & QuoteAssetReference & {
    marketPrice: string;
    askOrderBookEntries: OrderBookEntry[];
    bidOrderBookEntries: OrderBookEntry[];
};
export type BaseQuoteAssetPair = {
    baseAsset: Asset;
    quoteAsset: Asset;
};
export type MarketAggPrice = {
    assetPair: BaseQuoteAssetPair;
    data: {
        timestamp?: number;
        price?: number;
    }[];
};
export type MarketKline = {
    quoteAssetId: string;
    baseAssetId: string;
    priceAssetId: string;
    data: {
        open: number;
        high: number;
        low: number;
        close: number;
        time: string;
    }[];
};
export type MarketMakerMetricsBinnedOrders = WalletStakeKeyHash & {
    assetPair: {
        assetOne: Asset;
        assetTwo: Asset;
    };
    priceAssetId: string;
    data: {
        timestamp: number;
        roiPercent?: number;
        earnedPriceAssetAmount?: string;
        price?: number;
        assetOneAmountBought?: string;
        assetTwoAmountBought?: string;
        assetOneAmountNetPosition?: string;
        assetTwoAmountNetPosition?: string;
        assetOneBoughtCount?: string;
        assetTwoBoughtCount?: string;
        openTransactionFeeAmount?: string;
        cancelTransactionFeeAmount?: string;
        buyMakerFromAssetFeeAmount?: string;
        sellMakerFromAssetFeeAmount?: string;
        makerAdaFlatFeeAmount?: string;
    }[];
};
export type MarketOrderBookItem = {
    orderId?: string;
    baseAssetId?: string;
    baseAssetAmount?: string;
    quoteAssetId?: string;
    quoteAssetAmount?: string;
    "type"?: "ASK" | "BID";
};
export type MarketOrderBook = {
    time?: number;
    currentPrice?: string;
    orderBook?: MarketOrderBookItem[];
};
export type LiquidityDistributionItem = {
    assetId?: string;
    currentAmount?: string;
    price?: string;
};
export type MarketLiquidityDistribution = {
    time?: number;
    liquidityDistribution?: LiquidityDistributionItem[];
};
export type MarketVolume = {
    time?: number;
    referenceAssetVolumeAmount?: string;
};
export type MarketTradeVolume = {
    referenceAssetId?: string;
    series?: MarketVolume[];
};
export type MarketTotalVolumeLocked = {
    referenceAssetId?: string;
    series?: MarketVolume[];
};
export type TradingWalletSortByOptions = "+created" | "-created" | "+roiPercent" | "-roiPercent" | "+winRatePercent" | "-winRatePercent" | "+earnedAdaAssetAmount" | "-earnedAdaAssetAmount";
export type TradingWalletReference = {
    tradingWalletId: string;
};
export type TradingWalletStakeKeyHash = {
    tradingWalletStakeKeyHash: string;
};
export type StakeKeyUrl = {
    stakeKeyUrl: string | null;
};
export type TradingWallet = TradingWalletReference & TradingWalletStakeKeyHash & StakeKeyUrl & {
    assetOne: Asset;
    assetTwo: Asset;
    startDate?: string;
    roiPercent: number | null;
    winRatePercent: number | null;
    profitabilityWindowInterval: ("1d" | "1w" | "1mo" | "3mo" | "6mo" | "1y") | null;
    profitabilityHistory: ({
        timestamp: number;
        roiPercent?: number;
    })[];
    earnedAdaAssetAmount: string | null;
    tradesCount: string;
};
export type TradingWalletsResult = {
    count: number;
    next?: string;
    previous?: string;
    results: TradingWallet[];
};
export type TradingWalletErrorCode = "INVALID_TRADING_WALLET__INCORRECT_STAKE_KEY_HASH_FORMAT" | "INVALID_TRADING_WALLET__ALREADY_EXISTS";
export type TradingWalletError = {
    errorCode: TradingWalletErrorCode | NetworkErrorCode;
    message?: string;
};
export type TradingWalletId = string;
export type TradingWalletResult = TradingWallet;
export type AssetOneReference = {
    assetOneId: string;
};
export type AssetTwoReference = {
    assetTwoId: string;
};
export type TradingWalletData = AssetOneReference & AssetTwoReference & TradingWalletStakeKeyHash;
export type RegisterTradingWallet = TradingWalletData;
export type TradingWalletRegisterResult = TradingWalletReference;
export type UserType = "INDIVIDUAL" | "COMPANY";
export type UserConnect = WalletStakeKeyHash & {
    userId?: string;
    userType?: UserType;
    walletType: string;
};
export type UserKyc = {
    kycAccessToken?: string;
    isKycRequired: boolean;
    isKycRequiredReason?: string;
};
export type UserTerms = {
    termsUrl: string;
    termsVersion: string;
    isTermsAcceptanceRequired: boolean;
};
export type UserConnectResponse = UserKyc & UserTerms & {
    userId?: string;
};
export type ConnectErrorCode = "USER_CONNECT__INVALID_USER";
export type ConnectError = {
    errorCode: ConnectErrorCode;
    message?: string;
};
export type AbstractKycEvent = object;
export type KycSumsubReviewResult = {
    reviewAnswer: string;
};
export type KycSumsubEvent = AbstractKycEvent & {
    "type": string;
    clientId: string;
    createdAt: string;
    levelName?: string;
    applicantId: string;
    inspectionId: string;
    reviewStatus: string;
    reviewResult?: KycSumsubReviewResult;
    applicantType?: string;
    correlationId: string;
    externalUserId: string;
    sandboxMode?: boolean;
};
export type StakingProjectReference = {
    stakingProjectId: string;
};
export type StakeVaultLockDuration = "FLEX" | "MONTHS_1" | "MONTHS_3" | "MONTHS_6" | "MONTHS_9" | "MONTHS_12";
export type StakingProject = StakingProjectReference & {
    stakingAsset: Asset;
    lockDurationOptions: StakeVaultLockDuration[];
    imageLogoUrl: string;
};
export type StakingProjectsResult = {
    count: number;
    next?: string;
    previous?: string;
    results: StakingProject[];
};
export type WalletBalance = {
    walletBalance: string;
};
export type StakingProjectNftsRequest = WalletStakeKeyHash & WalletBalance;
export type StakingNftReference = {
    "type": string;
    subType: string;
};
export type StakingNft = StakingNftReference & {
    policyId: string;
    assetName: string;
    stackableWith: string[];
    imageUrl: string;
    name: string;
    apyBoost?: string;
    vestingBoost?: string;
};
export type StakingProjectNftsResult = {
    count: number;
    next?: string;
    previous?: string;
    results: StakingNft[];
};
export type StakeVaultReference = {
    stakeVaultId: string;
};
export type StakeVaultRewardState = {
    lockDuration: StakeVaultLockDuration;
    totalApy?: string;
    nftsApy?: string;
    revenueAmplifier?: string;
};
export type StakeVault = StakeVaultReference & {
    inactiveRewardState?: StakeVaultRewardState;
    activeRewardState?: StakeVaultRewardState;
    unlocksAt?: string;
    stakedAsset: Asset;
    stakedAssetAmount: string;
    stakedStakingNfts: StakingNft[];
    transactionUrl?: string;
    isUnstaked: boolean;
    isUnstakingEnabled: boolean;
};
export type StakeVaultsResult = {
    count: number;
    next?: string;
    previous?: string;
    results: StakeVault[];
};
export type StakeVaultNftUsageReport = {
    secondsRemaining: number | null;
};
export type StakeVaultData = StakingProjectReference & {
    stakedAssetAmount: string;
    lockDuration: StakeVaultLockDuration;
    stakingNfts: {
        "type": string;
        subType: string;
        assetName: string;
        policyId: string;
    }[];
};
export type CreateStakeVault = WalletAccount & StakeVaultData;
export type UnsignedStakeVaultData = StakeVaultData & UnsignedTransaction;
export type TransactionUrl = {
    transactionUrl: string;
};
export type UnsignedStakeVault = StakeVaultReference & UnsignedStakeVaultData & TransactionUrl & {
    unlocksAt: string;
};
export type StakeVaultErrorCode = "INVALID_STAKE_VAULT__NFT_COMBINATION" | "INVALID_STAKE_VAULT__VESTING_NFTS_NOT_ALLOWED" | "INVALID_STAKE_VAULT__INSUFFICIENT_BALANCE" | "INVALID_STAKE_VAULT__WALLET_ADDRESS_MISSING_STAKE_PART" | "INVALID_STAKE_VAULT__INVALID_LOCK_DURATION" | "INVALID_STAKE_VAULT__STAKED_ASSET_TOTAL_AMOUNT_LIMIT_REACHED" | "INVALID_STAKE_VAULT__STAKED_ASSET_AMOUNT_NOT_NUMBER";
export type StakeVaultError = {
    errorCode: TransactionErrorCode | StakeVaultErrorCode;
    message?: string;
};
export type UnstakeStakeVaultData = StakeVaultReference;
export type UnstakeStakeVault = WalletAccount & UnstakeStakeVaultData;
export type UnsignedUnstakeStakeVaultData = UnstakeStakeVaultData & UnsignedTransaction;
export type UnsignedUnstakeStakeVault = UnsignedUnstakeStakeVaultData & TransactionUrl;
export type StakeVaultCreateRewardsEstimate = {
    totalAssetAmountReward?: string;
    totalApyBoost?: string;
    totalRevenueAmplifier?: string;
    nftsApyBoost?: string;
    nftsApyDisclaimer?: string;
};
export type StakeVaultCreateRewardsEstimateResponse = StakeVaultCreateRewardsEstimate;
export type YieldFarmingRewardAsset = {
    assetAmount: string;
    asset: Asset;
};
export type YieldFarmingRewardsGroup = {
    assets: YieldFarmingRewardAsset[];
    groupName: string;
};
export type YieldFarmingRewardsResult = {
    rewardsClaimLovelaceServiceFee: string;
    rewardsGroups: YieldFarmingRewardsGroup[];
};
export type YieldFarmingRewardsClaim = WalletAccount;
export type CreateOptionData = {
    endDate: string;
    baseAssetId: string;
    quoteAssetId: string;
    baseAssetAmount: string;
    baseAssetShortName: string;
    quoteAssetShortName: string;
    baseAssetPrice: string;
};
export type CreateOption = WalletAccount & CreateOptionData;
export type RetrieveOption = WalletAccount & {
    optionAmount: string;
    optionUtxoRef: string;
};
export type ExecuteOption = WalletAccount & {
    optionAmount: string;
    optionUtxoRef: string;
};
export type TermsAccept = {
    acceptedTermsVersion: string;
};
/**
 * Get the circulating supply of an asset
 */
export function getAssetCirculatingSupply(assetId: string, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: CirculatingSupply;
    } | {
        status: 400;
        data: GeneralError;
    } | {
        status: 404;
        data: GeneralError;
    }>(`/circulating-supply/${assetId}`, {
        ...opts
    });
}
/**
 * Returns a list of projects, include user information if wallet address is provided
 */
export function listOrderSaleProjects({ status, annotateWalletStakeKeyHash, count, cursor }: {
    status?: OrderSaleProjectRoundStatus[];
    annotateWalletStakeKeyHash?: string;
    count?: number;
    cursor?: string;
} = {}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: OrderSaleProjectResults;
    }>(`/order-sale/projects${QS.query(QS.form({
        status,
        annotateWalletStakeKeyHash,
        count,
        cursor
    }))}`, {
        ...opts
    });
}
/**
 * Get a project, include user information if wallet address is provided
 */
export function getOrderSaleProject(orderSaleProjectId: string, { annotateWalletStakeKeyHash }: {
    annotateWalletStakeKeyHash?: string;
} = {}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: OrderSaleProject;
    } | {
        status: 400;
        data: GeneralError;
    } | {
        status: 404;
        data: GeneralError;
    }>(`/order-sale/project/${orderSaleProjectId}${QS.query(QS.form({
        annotateWalletStakeKeyHash
    }))}`, {
        ...opts
    });
}
/**
 * Returns a list of portfolio project where there is at least one order created by this user (identified by wallet address)
 */
export function listOrderSalePortfolioProjects({ filterByWalletStakeKeyHash, count, cursor }: {
    filterByWalletStakeKeyHash?: string;
    count?: number;
    cursor?: string;
} = {}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: OrderSalePortfolioResults;
    }>(`/order-sale/portfolio${QS.query(QS.form({
        filterByWalletStakeKeyHash,
        count,
        cursor
    }))}`, {
        ...opts
    });
}
/**
 * Returns a list of swap orders
 */
export function listSwapOrders({ sortSwapOrders, search, filterByAssetId, filterByToAssetId, filterByFromAssetId, orderId, filterByWalletStakeKeyHash, filterByCreatedLte, filterByCreatedGte, filterByOwner, filterByOrderSwapStatus, filterByOrderSwapType, filterByMinPrice, filterByMaxPrice, count, cursor }: {
    sortSwapOrders?: SwapOrderSortByOptions;
    search?: string[];
    filterByAssetId?: string[];
    filterByToAssetId?: string[];
    filterByFromAssetId?: string[];
    orderId?: string[];
    filterByWalletStakeKeyHash?: string;
    filterByCreatedLte?: string;
    filterByCreatedGte?: string;
    filterByOwner?: boolean;
    filterByOrderSwapStatus?: SwapOrderStatus;
    filterByOrderSwapType?: SwapOrderType | SwapOrderFillType;
    filterByMinPrice?: string;
    filterByMaxPrice?: string;
    count?: number;
    cursor?: string;
} = {}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: SwapOrderResults;
    } | {
        status: 400;
        data: OrderError;
    } | {
        status: 404;
        data: GeneralError;
    } | {
        status: 500;
        data: GeneralError;
    }>(`/order-swap${QS.query(QS.form({
        sortSwapOrders,
        search,
        filterByAssetId,
        filterByToAssetId,
        filterByFromAssetId,
        orderId,
        filterByWalletStakeKeyHash,
        filterByCreatedLte,
        filterByCreatedGte,
        filterByOwner,
        filterByOrderSwapStatus,
        filterByOrderSwapType,
        filterByMinPrice,
        filterByMaxPrice,
        count,
        cursor
    }))}`, {
        ...opts
    });
}
/**
 * Find the best available swap orders with given to / from asset amount and slippage percent
 */
export function findBestAvailableSwapOrders(toAssetId: string, fromAssetId: string, { toAssetAmount, fromAssetAmount, slippagePercent }: {
    toAssetAmount?: string;
    fromAssetAmount?: string;
    slippagePercent?: string;
} = {}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: BestAvailableSwapOrderResults;
    } | {
        status: 400;
        data: OrderError;
    } | {
        status: 404;
        data: OrderError;
    } | {
        status: 500;
        data: GeneralError;
    }>(`/order-swap/best-available${QS.query(QS.form({
        toAssetId,
        fromAssetId,
        toAssetAmount,
        fromAssetAmount,
        slippagePercent
    }))}`, {
        ...opts
    });
}
/**
 * Get a swap order by orderId
 */
export function getSwapOrder(orderId: string, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: SwapOrder;
    } | {
        status: 400;
        data: OrderError;
    } | {
        status: 404;
        data: GeneralError;
    } | {
        status: 500;
        data: GeneralError;
    }>(`/order-swap/${orderId}`, {
        ...opts
    });
}
/**
 * Get Swap Order Open Fee
 */
export function getSwapOrderOpenFee(openSwapOrder: OpenSwapOrder, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: SwapOrderMakerTotalFeesDeposit;
    } | {
        status: 400;
        data: OrderError;
    } | {
        status: 500;
        data: GeneralError;
    }>("/order-swap/open/fee", oazapfts.json({
        ...opts,
        method: "POST",
        body: openSwapOrder
    }));
}
/**
 * Get a sale order by orderId
 */
export function getSaleOrder(orderId: string, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: SaleOrder;
    } | {
        status: 400;
        data: SaleOrderError;
    } | {
        status: 404;
        data: GeneralError;
    } | {
        status: 500;
        data: GeneralError;
    }>(`/order-sale/${orderId}`, {
        ...opts
    });
}
/**
 * Open Swap Order
 */
export function openSwapOrder(openSwapOrder: OpenSwapOrder, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 201;
        data: UnsignedTransaction;
    } | {
        status: 400;
        data: OrderError;
    } | {
        status: 500;
        data: GeneralError;
    }>("/order-swap/open", oazapfts.json({
        ...opts,
        method: "POST",
        body: openSwapOrder
    }));
}
/**
 * Get Sale Order Fee
 */
export function getSaleOrderFee(openSaleOrder: OpenSaleOrder, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: SaleOrderTotalFeesDeposit;
    } | {
        status: 400;
        data: SaleOrderError;
    } | {
        status: 500;
        data: GeneralError;
    }>("/order-sale/fee", oazapfts.json({
        ...opts,
        method: "POST",
        body: openSaleOrder
    }));
}
/**
 * Open Sale Order
 */
export function openSaleOrder(openSaleOrder: OpenSaleOrder, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 201;
        data: UnsignedSaleOrder;
    } | {
        status: 400;
        data: SaleOrderError;
    } | {
        status: 500;
        data: GeneralError;
    }>("/order-sale/open", oazapfts.json({
        ...opts,
        method: "POST",
        body: openSaleOrder
    }));
}
/**
 * Cancel Swap Order
 */
export function cancelSwapOrder(orderId: string, cancelSwapOrder: CancelSwapOrder, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: UnsignedTransaction;
    } | {
        status: 400;
        data: OrderError;
    } | {
        status: 404;
        data: GeneralError;
    } | {
        status: 500;
        data: GeneralError;
    }>(`/order-swap/${orderId}/cancel`, oazapfts.json({
        ...opts,
        method: "PUT",
        body: cancelSwapOrder
    }));
}
/**
 * Fill Swap Orders
 */
export function fillSwapOrders(fillSwapOrders: FillSwapOrders, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: UnsignedTransaction;
    } | {
        status: 400;
        data: OrderError;
    } | {
        status: 500;
        data: GeneralError;
    }>("/order-swap/fill", oazapfts.json({
        ...opts,
        method: "POST",
        body: fillSwapOrders
    }));
}
/**
 * Get Swap Order Fill Fee
 */
export function getSwapOrderFillFee(fillSwapOrders: FillSwapOrders, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: SwapOrderTakerTotalFees;
    } | {
        status: 400;
        data: OrderError;
    } | {
        status: 500;
        data: GeneralError;
    }>("/order-swap/fill/fee", oazapfts.json({
        ...opts,
        method: "POST",
        body: fillSwapOrders
    }));
}
/**
 * Cancel Sale Order
 */
export function cancelSaleOrder(orderId: string, cancelSaleOrder: CancelSaleOrder, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: UnsignedSaleOrder;
    } | {
        status: 400;
        data: SaleOrderError;
    } | {
        status: 500;
        data: GeneralError;
    }>(`/order-sale/${orderId}/cancel`, oazapfts.json({
        ...opts,
        method: "PUT",
        body: cancelSaleOrder
    }));
}
/**
 * Returns a list of smart vaults
 */
export function listSmartVaults({ filterByWalletStakeKeyHash }: {
    filterByWalletStakeKeyHash?: string;
} = {}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: SmartVaultListResult;
    } | {
        status: 400;
        data: OrderError;
    } | {
        status: 500;
        data: GeneralError;
    }>(`/smart-vault${QS.query(QS.form({
        filterByWalletStakeKeyHash
    }))}`, {
        ...opts
    });
}
/**
 * Find smart vault by smartVaultId
 */
export function getSmartVault(smartVaultId: SmartVaultId, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: SmartVaultResult;
    } | {
        status: 400;
        data: OrderError;
    } | {
        status: 404;
        data: GeneralError;
    } | {
        status: 500;
        data: GeneralError;
    }>(`/smart-vault/${smartVaultId}`, {
        ...opts
    });
}
/**
 * Returns a list of operations for a smart vault
 */
export function listSmartVaultOperations(smartVaultId: SmartVaultId, { filterByWalletStakeKeyHash }: {
    filterByWalletStakeKeyHash?: string;
} = {}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: SmartVaultOperationListResult;
    } | {
        status: 400;
        data: OrderError;
    } | {
        status: 404;
        data: GeneralError;
    } | {
        status: 500;
        data: GeneralError;
    }>(`/smart-vault/${smartVaultId}/operation${QS.query(QS.form({
        filterByWalletStakeKeyHash
    }))}`, {
        ...opts
    });
}
/**
 * Returns a list of smart vault strategies
 */
export function listSmartVaultStrategies(opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: SmartVaultStrategyListResult;
    } | {
        status: 500;
        data: GeneralError;
    }>("/smart-vault/strategy", {
        ...opts
    });
}
/**
 * Open a new smart vault and deposit tokens into it
 */
export function smartVaultOpen(smartVaultOpen: SmartVaultOpen, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 201;
        data: UnsignedTransaction;
    } | {
        status: 400;
        data: SmartVaultError;
    } | {
        status: 500;
        data: GeneralError;
    }>("/smart-vault/open", oazapfts.json({
        ...opts,
        method: "POST",
        body: smartVaultOpen
    }));
}
/**
 * Deposit tokens into existing smart vault
 */
export function smartVaultDeposit(smartVaultDeposit: SmartVaultDeposit, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 201;
        data: UnsignedTransaction;
    } | {
        status: 400;
        data: SmartVaultError;
    } | {
        status: 500;
        data: GeneralError;
    }>("/smart-vault/deposit", oazapfts.json({
        ...opts,
        method: "POST",
        body: smartVaultDeposit
    }));
}
/**
 * Get an estimate for assets available to be withdrawn
 */
export function smartVaultWithdrawEstimate(smartVaultWithdrawEstimate: SmartVaultWithdrawEstimate, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 201;
        data: SmartVaultWithdrawEstimateResult;
    } | {
        status: 400;
        data: SmartVaultError;
    } | {
        status: 500;
        data: GeneralError;
    }>("/smart-vault/withdraw/estimate", oazapfts.json({
        ...opts,
        method: "POST",
        body: smartVaultWithdrawEstimate
    }));
}
/**
 * Withdraw some or all tokens deposited into the smart vault
 */
export function smartVaultWithdraw(smartVaultWithdraw: SmartVaultWithdraw, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 201;
        data: UnsignedTransaction;
    } | {
        status: 400;
        data: SmartVaultError;
    } | {
        status: 500;
        data: GeneralError;
    }>("/smart-vault/withdraw", oazapfts.json({
        ...opts,
        method: "POST",
        body: smartVaultWithdraw
    }));
}
/**
 * Close smart vault which has no deposited assets
 */
export function smartVaultClose(smartVaultClose: SmartVaultClose, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 201;
        data: UnsignedTransaction;
    } | {
        status: 400;
        data: SmartVaultError;
    } | {
        status: 500;
        data: GeneralError;
    }>("/smart-vault/close", oazapfts.json({
        ...opts,
        method: "POST",
        body: smartVaultClose
    }));
}
/**
 * Returns a list of TradingPairs
 */
export function listTradingPairs(opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: TradingPairsResults;
    }>("/trading-pair", {
        ...opts
    });
}
/**
 * Returns a list of LiquidityPools
 */
export function listLiquidityPool({ sort, search, count, cursor }: {
    sort?: string;
    search?: string[];
    count?: number;
    cursor?: string;
} = {}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: LiquidityPoolsResults;
    }>(`/liquidity-pool${QS.query(QS.form({
        sort,
        search,
        count,
        cursor
    }))}`, {
        ...opts
    });
}
/**
 * Find liquidityPool by liquidityPoolId
 */
export function getLiquidityPool(liquidityPoolId: LiquidityPoolReference, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: LiquidityPool;
    } | {
        status: 400;
        data: GeneralError;
    } | {
        status: 404;
        data: GeneralError;
    }>(`/liquidity-pool/${liquidityPoolId}`, {
        ...opts
    });
}
/**
 * Find liquidityPool by it's asset pair
 */
export function getLiquidityPoolByAssetPair(assetPair: string, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: LiquidityPool;
    } | {
        status: 400;
        data: GeneralError;
    } | {
        status: 404;
        data: GeneralError;
    }>(`/liquidity-pool/byAssets/${assetPair}`, {
        ...opts
    });
}
/**
 * Returns a list of liquidity positions
 */
export function listLiquidityPositions({ sort, search, liquidityPositionId, walletStakeKeyHash, status, filterByAssetId, filterByCreatedLte, filterByCreatedGte, count, cursor }: {
    sort?: string;
    search?: string[];
    liquidityPositionId?: string[];
    walletStakeKeyHash?: string[];
    status?: LiquidityPositionStatus[];
    filterByAssetId?: string[];
    filterByCreatedLte?: string;
    filterByCreatedGte?: string;
    count?: number;
    cursor?: string;
} = {}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: {
            count?: number;
            next?: string;
            previous?: string;
            results?: LiquidityPosition[];
        };
    }>(`/liquidity-position${QS.query(QS.form({
        sort,
        search,
        liquidityPositionId,
        walletStakeKeyHash,
        status,
        filterByAssetId,
        filterByCreatedLte,
        filterByCreatedGte,
        count,
        cursor
    }))}`, {
        ...opts
    });
}
/**
 * Find LP by liquidityPositionId
 */
export function getLiquidityPosition(liquidityPositionId: string, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: LiquidityPosition;
    } | {
        status: 400;
        data: GeneralError;
    } | {
        status: 404;
        data: GeneralError;
    }>(`/liquidity-position/${liquidityPositionId}`, {
        ...opts
    });
}
/**
 * Open Liquidity Position
 */
export function openLiquidityPosition(openLiquidityPosition: OpenLiquidityPosition, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 201;
        data: UnsignedLiquidityPosition;
    } | {
        status: 400;
        data: GeneralError;
    }>("/liquidity-position/open", oazapfts.json({
        ...opts,
        method: "POST",
        body: openLiquidityPosition
    }));
}
/**
 * Close Liquidity Position
 */
export function closeLiquidityPosition(liquidityPositionId: string, liquidityPositionClose: LiquidityPositionClose, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: UnsignedLiquidityPosition;
    } | {
        status: 400;
        data: GeneralError;
    }>(`/liquidity-position/${liquidityPositionId}/close`, oazapfts.json({
        ...opts,
        method: "PUT",
        body: liquidityPositionClose
    }));
}
/**
 * Submit Transaction
 */
export function submitTransaction(signedTransaction: SignedTransaction, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: TransactionSubmitSuccessResponse;
    } | {
        status: 202;
        data: TransactionSubmitAcceptedResponse;
    } | {
        status: 400;
        data: GeneralError;
    }>("/transaction/submit", oazapfts.json({
        ...opts,
        method: "POST",
        body: signedTransaction
    }));
}
/**
 * Returns the order book
 */
export function getOrderBookByAssets(assetPair: string, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: OrderBook;
    } | {
        status: 500;
        data: GeneralError;
    }>(`/order-book/by-asset-pair/${assetPair}`, {
        ...opts
    });
}
/**
 * returns aggregated price timeseries data
 */
export function getOrderSwapAggregatedPrices(assetPair: string, startTime: string, endTime: string, binInterval: "15m" | "30m" | "1h" | "4h" | "1d" | "1w", opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: MarketAggPrice;
    } | {
        status: 400;
        data: GeneralError;
    } | {
        status: 404;
        data: GeneralError;
    }>(`/market/by-asset-pair/${assetPair}/agg-price-history${QS.query(QS.form({
        startTime,
        endTime,
        binInterval
    }))}`, {
        ...opts
    });
}
/**
 * return a list of kline timeseries data
 */
export function getOrderSwapKlineAggregatedPrices(assetPair: string, startTime: string, endTime: string, binInterval: "15m" | "30m" | "1h" | "4h" | "1d" | "1w", opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: MarketKline;
    } | {
        status: 400;
        data: GeneralError;
    } | {
        status: 404;
        data: GeneralError;
    }>(`/market/by-asset-pair/${assetPair}/kline${QS.query(QS.form({
        startTime,
        endTime,
        binInterval
    }))}`, {
        ...opts
    });
}
/**
 * get aggregated market maker earned and ROI metrics within time window
 */
export function getOrderSwapMarketMakerBinnedOrders(assetPair: string, startTime: string, endTime: string, binInterval: "15m" | "30m" | "1h" | "4h" | "1d" | "1w", { filterByWalletStakeKeyHash }: {
    filterByWalletStakeKeyHash?: string;
} = {}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: MarketMakerMetricsBinnedOrders;
    } | {
        status: 400;
        data: GeneralError;
    } | {
        status: 404;
        data: GeneralError;
    }>(`/market/by-asset-pair/${assetPair}/maker-metrics/binned-orders${QS.query(QS.form({
        filterByWalletStakeKeyHash,
        startTime,
        endTime,
        binInterval
    }))}`, {
        ...opts
    });
}
/**
 * return a list of order book data
 */
export function listOrderBook(liquidityPoolId: LiquidityPoolReference, { count, marketPrecisionFilter }: {
    count?: number;
    marketPrecisionFilter?: string;
} = {}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: MarketOrderBook[];
    } | {
        status: 400;
        data: GeneralError;
    } | {
        status: 404;
        data: GeneralError;
    }>(`/market/liquidity-pool/${liquidityPoolId}/order-book${QS.query(QS.form({
        count,
        marketPrecisionFilter
    }))}`, {
        ...opts
    });
}
/**
 * return a list of liquidity distribution data
 */
export function listLiquidityPositionsDistribution(liquidityPoolId: LiquidityPoolReference, startTime: string, endTime: string, { count }: {
    count?: number;
} = {}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: MarketLiquidityDistribution[];
    } | {
        status: 400;
        data: GeneralError;
    } | {
        status: 404;
        data: GeneralError;
    }>(`/market/liquidity-pool/${liquidityPoolId}/liquidity-distribution${QS.query(QS.form({
        startTime,
        endTime,
        count
    }))}`, {
        ...opts
    });
}
/**
 * return a list of trade volume amount timeseries data
 */
export function listLiquidityPositionsTradeVolume(liquidityPoolId: LiquidityPoolReference, startTime: string, endTime: string, { count }: {
    count?: number;
} = {}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: MarketTradeVolume[];
    } | {
        status: 400;
        data: GeneralError;
    } | {
        status: 404;
        data: GeneralError;
    }>(`/market/liquidity-pool/${liquidityPoolId}/trade-volume${QS.query(QS.form({
        startTime,
        endTime,
        count
    }))}`, {
        ...opts
    });
}
/**
 * return a list of TVL timeseries data
 */
export function listLiquidityPositionsTvl(liquidityPoolId: LiquidityPoolReference, startTime: string, endTime: string, { count }: {
    count?: number;
} = {}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: MarketTotalVolumeLocked[];
    } | {
        status: 400;
        data: GeneralError;
    } | {
        status: 404;
        data: GeneralError;
    } | {
        status: 500;
        data: GeneralError;
    }>(`/market/liquidity-pool/${liquidityPoolId}/total-volume-locked${QS.query(QS.form({
        startTime,
        endTime,
        count
    }))}`, {
        ...opts
    });
}
/**
 * Returns a list of trading wallets
 */
export function listTradingWallets({ filterByWalletStakeKeyHash, filterByAssetPair, filterTradingWalletRuntimeLte, filterTradingWalletRuntimeGte, sortTradingWalletOrderBy, count, cursor }: {
    filterByWalletStakeKeyHash?: string;
    filterByAssetPair?: string;
    filterTradingWalletRuntimeLte?: number;
    filterTradingWalletRuntimeGte?: number;
    sortTradingWalletOrderBy?: TradingWalletSortByOptions;
    count?: number;
    cursor?: string;
} = {}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: TradingWalletsResult;
    } | {
        status: 400;
        data: TradingWalletError;
    } | {
        status: 500;
        data: GeneralError;
    }>(`/trading-wallet${QS.query(QS.form({
        filterByWalletStakeKeyHash,
        filterByAssetPair,
        filterTradingWalletRuntimeLte,
        filterTradingWalletRuntimeGte,
        sortTradingWalletOrderBy,
        count,
        cursor
    }))}`, {
        ...opts
    });
}
/**
 * Returns a trading wallet
 */
export function getTradingWallet(tradingWalletId: TradingWalletId, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: TradingWalletResult;
    } | {
        status: 400;
        data: TradingWalletError;
    } | {
        status: 404;
        data: GeneralError;
    } | {
        status: 500;
        data: GeneralError;
    }>(`/trading-wallet/${tradingWalletId}`, {
        ...opts
    });
}
/**
 * Register Trading Wallet
 */
export function registerTradingWallet(registerTradingWallet: RegisterTradingWallet, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 201;
        data: TradingWalletRegisterResult;
    } | {
        status: 400;
        data: TradingWalletError;
    } | {
        status: 500;
        data: GeneralError;
    }>("/trading-wallet/register", oazapfts.json({
        ...opts,
        method: "POST",
        body: registerTradingWallet
    }));
}
/**
 * get or create a new user with specified wallet address or generate an access token if the user is not identified
 */
export function connectWallet(userConnect: UserConnect, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: UserConnectResponse;
    } | {
        status: 400;
        data: ConnectError;
    }>("/user/connect", oazapfts.json({
        ...opts,
        method: "POST",
        body: userConnect
    }));
}
/**
 * receive an applicant status update from Sumsub
 */
export function createSumsubEvent(kycSumsubEvent: KycSumsubEvent, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
    } | {
        status: 400;
        data: GeneralError;
    }>("/user/event-sumsub", oazapfts.json({
        ...opts,
        method: "POST",
        body: kycSumsubEvent
    }));
}
/**
 * Returns all staking projects
 */
export function listStakingProjects({ count, cursor }: {
    count?: number;
    cursor?: string;
} = {}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: StakingProjectsResult;
    }>(`/staking-projects${QS.query(QS.form({
        count,
        cursor
    }))}`, {
        ...opts
    });
}
/**
 * Returns a list of NFTs which can be applied to a stake vault
 */
export function listStakingProjectNfts(stakingProjectId: string, stakingProjectNftsRequest: StakingProjectNftsRequest, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: StakingProjectNftsResult;
    }>(`/staking-project/${stakingProjectId}/nfts`, oazapfts.json({
        ...opts,
        method: "POST",
        body: stakingProjectNftsRequest
    }));
}
/**
 * Returns all stake vaults created by a wallet
 */
export function listStakeVaults({ filterByWalletStakeKeyHash, count, cursor }: {
    filterByWalletStakeKeyHash?: string;
    count?: number;
    cursor?: string;
} = {}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: StakeVaultsResult;
    }>(`/stake-vaults${QS.query(QS.form({
        filterByWalletStakeKeyHash,
        count,
        cursor
    }))}`, {
        ...opts
    });
}
/**
 * Returns report which indicates nft usage time remaining
 */
export function getStakeVaultNftUsageReport(assetId: string, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: StakeVaultNftUsageReport;
    }>(`/stake-vault/nft-usage-report/${assetId}`, {
        ...opts
    });
}
/**
 * Create a new stake vault
 */
export function createStakeVault(createStakeVault?: CreateStakeVault, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 201;
        data: UnsignedStakeVault;
    } | {
        status: 400;
        data: StakeVaultError;
    } | {
        status: 500;
        data: GeneralError;
    }>("/stake-vault/create", oazapfts.json({
        ...opts,
        method: "POST",
        body: createStakeVault
    }));
}
/**
 * Unstake an existing stake vault
 */
export function unstakeStakeVault(unstakeStakeVault?: UnstakeStakeVault, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 201;
        data: UnsignedUnstakeStakeVault;
    } | {
        status: 400;
        data: StakeVaultError;
    } | {
        status: 500;
        data: GeneralError;
    }>("/stake-vault/unstake", oazapfts.json({
        ...opts,
        method: "POST",
        body: unstakeStakeVault
    }));
}
/**
 * Returns the estimated total rewards the stake vault will yield
 */
export function getStakeVaultCreateRewardsEstimate(createStakeVault: CreateStakeVault, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: StakeVaultCreateRewardsEstimateResponse;
    } | {
        status: 400;
        data: StakeVaultError;
    } | {
        status: 500;
        data: GeneralError;
    }>("/stake-vault/create/rewards-estimate", oazapfts.json({
        ...opts,
        method: "POST",
        body: createStakeVault
    }));
}
/**
 * List accrued assets' rewards
 */
export function yieldFarmingListRewards({ count, cursor }: {
    count?: number;
    cursor?: string;
} = {}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: YieldFarmingRewardsResult;
    }>(`/yield-farming/rewards${QS.query(QS.form({
        count,
        cursor
    }))}`, {
        ...opts
    });
}
/**
 * Claim accrued rewards
 */
export function yieldFarmingRewardsClaim(yieldFarmingRewardsClaim?: YieldFarmingRewardsClaim, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 201;
        data: UnsignedTransaction;
    } | {
        status: 500;
        data: GeneralError;
    }>("/yield-farming/rewards/claim", oazapfts.json({
        ...opts,
        method: "POST",
        body: yieldFarmingRewardsClaim
    }));
}
/**
 * Create a new option
 */
export function createOption(createOption?: CreateOption, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: UnsignedTransaction;
    }>("/option/create", oazapfts.json({
        ...opts,
        method: "POST",
        body: createOption
    }));
}
/**
 * Retrieve an existing option option
 */
export function retrieveOption(retrieveOption?: RetrieveOption, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: UnsignedTransaction;
    }>("/option/retrieve", oazapfts.json({
        ...opts,
        method: "POST",
        body: retrieveOption
    }));
}
/**
 * Execute an existing option
 */
export function executeOption(executeOption?: ExecuteOption, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: UnsignedTransaction;
    }>("/option/execute", oazapfts.json({
        ...opts,
        method: "POST",
        body: executeOption
    }));
}
/**
 * accept the latest terms version
 */
export function termsAccept(termsAccept: TermsAccept, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
    } | {
        status: 400;
        data: GeneralError;
    }>("/terms/accept", oazapfts.json({
        ...opts,
        method: "POST",
        body: termsAccept
    }));
}
