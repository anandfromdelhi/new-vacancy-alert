export interface JobAlertSubscription {
  id: string; // deterministic: `${userId}_${qualification}_${location}`
  userId: string;
  userEmail: string;
  userName?: string;
  qualification: string; // slug, e.g. "btech", "mbbs-doctor"
  qualificationLabel: string; // clean label, e.g. "B.Tech / B.E"
  location: string; // slug, e.g. "delhi", "all-india"
  locationLabel: string; // clean label, e.g. "Delhi", "All India"
  isActive: boolean;
  sourceJobId?: string;
  sourceJobTitle?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface NotificationLog {
  id?: string;
  userId: string;
  subscriptionId: string;
  jobId: string;
  jobTitle?: string;
  channel: 'telegram' | string;
  status: 'sent' | 'failed' | 'skipped' | 'in-flight' | 'pending';
  telegramChatId?: string;
  telegramMessageId?: number | null;
  qualification?: string;
  qualificationLabel?: string;
  location?: string;
  locationLabel?: string;
  sentAt?: string;
  claimedAt?: string;
  createdAt: string;
  errorMessage?: string;
  isTest?: boolean;
  details?: string;
}

export interface TelegramSendResult {
  success: boolean;
  messageId?: number;
  blockedOrDeactivated?: boolean;
  rateLimited?: boolean;
  retryAfterSeconds?: number;
  error?: string;
}

export interface MatchedSubscriptionDiagnostic {
  maskedUserId: string;
  maskedSubscriptionId: string;
  qualificationLabel: string;
  locationLabel: string;
  isActive: boolean;
  sameUserTelegramActive: boolean;
}

export interface DispatchMetrics {
  jobId: string;
  jobTitle?: string;
  totalActiveSubscriptionsQueried?: number;
  jobCombinations?: string[];
  matchedSubscriptions: number;
  rejectedSubscriptions?: number;
  rejectionSample?: string[];
  matchedSummary?: MatchedSubscriptionDiagnostic[];
  telegramConnected: number;
  sent: number;
  skipped: number;
  failed: number;
  duplicates: number;
  dryRun: boolean;
  durationMs: number;
}

export interface AlertOptionItem {
  slug: string;
  label: string;
}

export interface AlertCombination {
  qualificationSlug: string;
  qualificationLabel: string;
  locationSlug: string;
  locationLabel: string;
}

export interface JobAlertOptions {
  jobId: string;
  jobTitle: string;
  qualifications: AlertOptionItem[];
  locations: AlertOptionItem[];
  validCombinations: AlertCombination[];
  isSingleCombination: boolean;
}

export interface TelegramLink {
  userId: string;
  telegramChatId: string;
  telegramUsername?: string;
  telegramFirstName?: string;
  connectedAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface TelegramPairingToken {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'used' | 'expired';
  usedAt?: string;
  usedByTelegramChatId?: string;
}

