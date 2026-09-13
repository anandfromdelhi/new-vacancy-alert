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
  channel: 'telegram' | string;
  status: 'sent' | 'failed' | 'pending';
  sentAt: string;
  details?: string;
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

