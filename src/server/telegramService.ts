import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { getAdminDb } from './firebaseAdmin';
import { TelegramLink, TelegramPairingToken } from '../types/alertTypes';

export const TELEGRAM_LINKS_COLLECTION = 'telegram_links';
export const PAIRING_TOKENS_COLLECTION = 'telegram_pairing_tokens';

// Fallback local file store path for development when service account is not yet configured
const DEV_STORE_DIR = path.resolve(process.cwd(), 'scratch');
const DEV_STORE_FILE = path.join(DEV_STORE_DIR, 'telegram_dev_store.json');

function readDevStore(): { tokens: Record<string, TelegramPairingToken>; links: Record<string, TelegramLink> } {
  try {
    if (fs.existsSync(DEV_STORE_FILE)) {
      return JSON.parse(fs.readFileSync(DEV_STORE_FILE, 'utf-8'));
    }
  } catch {
    // ignore
  }
  return { tokens: {}, links: {} };
}

function writeDevStore(data: { tokens: Record<string, TelegramPairingToken>; links: Record<string, TelegramLink> }) {
  try {
    if (!fs.existsSync(DEV_STORE_DIR)) {
      fs.mkdirSync(DEV_STORE_DIR, { recursive: true });
    }
    fs.writeFileSync(DEV_STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write to dev store:', err);
  }
}

/**
 * Returns the Telegram bot username from environment variables.
 */
export function getBotUsername(): string {
  return process.env.TELEGRAM_BOT_USERNAME || 'NewVacancyAlertBot';
}

/**
 * Sends a message to a Telegram chat using Telegram Bot API.
 */
export async function sendTelegramMessage(chatId: string | number, text: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    console.warn(`[Telegram Mock] TELEGRAM_BOT_TOKEN is not set. Simulated sending to chat ${chatId}: "${text}"`);
    return true;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML'
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`Failed to send Telegram message to ${chatId}:`, errBody);
      return false;
    }

    return true;
  } catch (err) {
    console.error(`Error in sendTelegramMessage to ${chatId}:`, err);
    return false;
  }
}

/**
 * Generates a secure, 10-minute single-use pairing token for an authenticated Firebase user.
 * Notice: Exposes NO user personal information (email, name, or UID) in the token string.
 */
export async function createPairingToken(userId: string): Promise<{
  token: string;
  deepLink: string;
  expiresAt: string;
  botUsername: string;
}> {
  if (!userId) {
    throw new Error('UserId is required to create a pairing token');
  }

  // 64-character cryptographically random token (256 bits of entropy)
  const token = crypto.randomBytes(32).toString('hex');
  const now = new Date();
  const createdAt = now.toISOString();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000).toISOString(); // 10 minutes

  const tokenRecord: TelegramPairingToken = {
    token,
    userId,
    createdAt,
    expiresAt,
    status: 'pending'
  };

  const db = getAdminDb();
  let savedToFirestore = false;

  if (db) {
    try {
      await db.collection(PAIRING_TOKENS_COLLECTION).doc(token).set(tokenRecord);
      savedToFirestore = true;
    } catch (err: any) {
      console.warn('Firestore write failed, using local dev store fallback:', err.message);
    }
  }

  if (!savedToFirestore) {
    const store = readDevStore();
    store.tokens[token] = tokenRecord;
    writeDevStore(store);
  }

  const botUsername = getBotUsername();
  const deepLink = `https://t.me/${botUsername}?start=${token}`;

  return {
    token,
    deepLink,
    expiresAt,
    botUsername
  };
}

/**
 * Retrieves a pairing token by its token string.
 */
export async function getPairingToken(token: string): Promise<TelegramPairingToken | null> {
  if (!token) return null;

  const db = getAdminDb();
  if (db) {
    try {
      const docSnap = await db.collection(PAIRING_TOKENS_COLLECTION).doc(token).get();
      if (docSnap.exists) {
        return docSnap.data() as TelegramPairingToken;
      }
    } catch {
      // Fall through to dev store
    }
  }

  const store = readDevStore();
  return store.tokens[token] || null;
}

/**
 * Marks a pairing token as used.
 */
export async function markTokenAsUsed(token: string, chatId: string): Promise<void> {
  const nowIso = new Date().toISOString();
  const db = getAdminDb();

  if (db) {
    try {
      await db.collection(PAIRING_TOKENS_COLLECTION).doc(token).update({
        status: 'used',
        usedAt: nowIso,
        usedByTelegramChatId: chatId
      });
    } catch {
      // ignore
    }
  }

  const store = readDevStore();
  if (store.tokens[token]) {
    store.tokens[token].status = 'used';
    store.tokens[token].usedAt = nowIso;
    store.tokens[token].usedByTelegramChatId = chatId;
    writeDevStore(store);
  }
}

/**
 * Saves or updates a Telegram link for a user.
 */
export async function saveTelegramLink(link: TelegramLink): Promise<void> {
  const db = getAdminDb();

  if (db) {
    try {
      await db.collection(TELEGRAM_LINKS_COLLECTION).doc(link.userId).set(link);
      console.log(`[Firestore] Successfully saved telegram_links/${link.userId}`);
    } catch (err: any) {
      console.error('[Firestore] Failed to save telegram link to Firestore:', err.message);
    }
  } else {
    console.warn(`[Firestore] getAdminDb() is null - saving telegram_links/${link.userId} to local fallback store`);
  }

  const store = readDevStore();
  store.links[link.userId] = link;
  writeDevStore(store);
}

/**
 * Retrieves the Telegram connection record for a user.
 */
export async function getTelegramLink(userId: string): Promise<TelegramLink | null> {
  if (!userId) return null;

  const db = getAdminDb();
  if (db) {
    try {
      const docSnap = await db.collection(TELEGRAM_LINKS_COLLECTION).doc(userId).get();
      if (docSnap.exists) {
        return docSnap.data() as TelegramLink;
      }
    } catch (err: any) {
      console.error('[Firestore] Error reading telegram link from Firestore:', err.message);
    }
  }

  const store = readDevStore();
  const fallbackLink = store.links[userId] || null;

  // Auto-sync: If found in fallback store and Firestore is active, copy to Firestore
  if (fallbackLink && db) {
    try {
      await db.collection(TELEGRAM_LINKS_COLLECTION).doc(userId).set(fallbackLink);
      console.log(`[Firestore] Synced local store telegram link to Firestore for ${userId}`);
    } catch {}
  }

  return fallbackLink;
}

/**
 * Disconnects the Telegram account for a given user.
 * Leaves all existing job alert subscriptions intact!
 */
export async function disconnectTelegram(userId: string): Promise<{ success: boolean; message: string }> {
  if (!userId) {
    return { success: false, message: 'User ID is required' };
  }

  const nowIso = new Date().toISOString();
  const existing = await getTelegramLink(userId);

  if (!existing || !existing.isActive) {
    return { success: true, message: 'Telegram was already disconnected.' };
  }

  const updated: TelegramLink = {
    ...existing,
    isActive: false,
    updatedAt: nowIso
  };

  await saveTelegramLink(updated);
  return { success: true, message: 'Telegram account disconnected successfully.' };
}

/**
 * Main Webhook Processing function for Telegram updates.
 * Handles /start <TOKEN> commands.
 */
export async function processTelegramWebhook(body: any): Promise<{ handled: boolean; reason?: string }> {
  if (!body || !body.message) {
    return { handled: false, reason: 'No message in update' };
  }

  const message = body.message;
  const chatId = message.chat?.id;
  const text = (message.text || '').trim();

  if (!chatId || !text) {
    return { handled: false, reason: 'Missing chat ID or text' };
  }

  // Check if message is a /start command
  if (!text.toLowerCase().startsWith('/start')) {
    // Non-start command: respond with helpful guide
    await sendTelegramMessage(
      chatId,
      'ℹ️ <b>NewVacancyAlert Bot</b>\n\nThis bot delivers verified government recruitment alerts directly to you. To link your account or manage alerts, visit:\nhttps://newvacancyalert.in/manage-alerts'
    );
    return { handled: true };
  }

  // Extract parameter: /start <TOKEN>
  const parts = text.split(/\s+/);
  const tokenParam = parts[1]?.trim();

  if (!tokenParam) {
    await sendTelegramMessage(
      chatId,
      '👋 <b>Welcome to NewVacancyAlert Job Alerts!</b>\n\nTo connect this Telegram account to your job alerts:\n1. Go to <a href="https://newvacancyalert.in/manage-alerts">NewVacancyAlert.in/manage-alerts</a>\n2. Click <b>Connect Telegram</b>\n3. Tap the link to open Telegram and press Start.'
    );
    return { handled: true };
  }

  // Look up token in database
  const pairingToken = await getPairingToken(tokenParam);

  if (!pairingToken) {
    await sendTelegramMessage(
      chatId,
      '⚠️ <b>Invalid Connection Link</b>\n\nThis connection token was not recognized. Please visit <a href="https://newvacancyalert.in/manage-alerts">NewVacancyAlert.in/manage-alerts</a> to generate a new connection link.'
    );
    return { handled: true, reason: 'Token not found' };
  }

  if (pairingToken.status === 'used') {
    await sendTelegramMessage(
      chatId,
      '⚠️ <b>Link Already Used</b>\n\nThis connection link has already been used. If you need to reconnect, please generate a fresh link from <a href="https://newvacancyalert.in/manage-alerts">NewVacancyAlert.in/manage-alerts</a>.'
    );
    return { handled: true, reason: 'Token already used' };
  }

  const now = Date.now();
  const expiresAtMs = new Date(pairingToken.expiresAt).getTime();

  if (now > expiresAtMs) {
    await sendTelegramMessage(
      chatId,
      '⚠️ <b>Connection Link Expired</b>\n\nFor your security, connection links expire after 10 minutes. Please generate a new one from <a href="https://newvacancyalert.in/manage-alerts">NewVacancyAlert.in/manage-alerts</a>.'
    );
    return { handled: true, reason: 'Token expired' };
  }

  // Token is valid and pending! Pair the account
  const nowIso = new Date().toISOString();
  const linkRecord: TelegramLink = {
    userId: pairingToken.userId,
    telegramChatId: String(chatId),
    telegramUsername: message.from?.username || '',
    telegramFirstName: message.from?.first_name || '',
    connectedAt: nowIso,
    updatedAt: nowIso,
    isActive: true
  };

  await saveTelegramLink(linkRecord);
  await markTokenAsUsed(tokenParam, String(chatId));

  // Send success confirmation message
  await sendTelegramMessage(
    chatId,
    '✅ <b>Telegram connected successfully!</b>\n\nYou will receive NewVacancyAlert job notifications here based on your active job alerts.\n\nYou can manage or pause your alert preferences anytime at <a href="https://newvacancyalert.in/manage-alerts">NewVacancyAlert.in/manage-alerts</a>.'
  );

  console.log(`[Telegram Webhook] Successfully linked Telegram chat ${chatId} to Firebase user ${pairingToken.userId}`);
  return { handled: true };
}
