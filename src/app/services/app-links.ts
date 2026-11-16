/**
 * Single source of truth for the store links and for "which store does this
 * visitor need?". Used by the badges, the navbar CTA, and the /download
 * smart-link page.
 */
import { environment } from '../../environments/environment';

/**
 * Region-neutral App Store link: Apple redirects to the visitor's own storefront.
 * The previous hardcoded value pinned every visitor to the Jordanian store (/jo/).
 */
export const APP_STORE_URL = environment.appStoreUrl;

/** App Store Connect campaign tokens: short, URL-safe names only. */
const CAMPAIGN_TOKEN = /^[A-Za-z0-9_.-]{1,40}$/;

/**
 * The store link for one visit. When the visitor arrived with a campaign token
 * (/download?ct=meta_t2_gulf) and the provider token is configured, this is an
 * App Store Connect campaign link, so downloads show up per campaign in App
 * Analytics. Otherwise — no token, a malformed one, or no provider token — it is
 * the plain store URL, exactly as before.
 */
export function storeUrlFor(campaign: string | null | undefined): string {
  const pt = environment.appStoreProviderToken;
  if (!pt || !campaign || !CAMPAIGN_TOKEN.test(campaign)) return APP_STORE_URL;
  const q = new URLSearchParams({ pt, ct: campaign, mt: '8' });
  return `https://apps.apple.com/app/apple-store/id${environment.appStoreId}?${q}`;
}

/** Which app's built-in browser the page is open in, if any. */
export type InAppBrowser = 'instagram' | 'messenger' | 'facebook' | 'other' | null;

/**
 * Instagram's browser hands an automatic redirect to the App Store; Messenger's
 * does not (it stays on the page until the visitor taps). Knowing which one we're
 * in lets the page skip the wait there, and lets analytics split the numbers.
 */
export function detectInAppBrowser(): InAppBrowser {
  if (typeof navigator === 'undefined') return null;
  const ua = navigator.userAgent || '';
  if (/Instagram/i.test(ua)) return 'instagram';
  if (/MessengerForiOS|FB_IAB\/MESSENGER|\bMessenger\b/i.test(ua)) return 'messenger';
  if (/FBAN|FBAV|FBIOS|FB_IAB/i.test(ua)) return 'facebook';
  if (/Snapchat|TikTok|musical_ly|BytedanceWebview|Twitter|Line\/|WhatsApp/i.test(ua)) return 'other';
  return null;
}

export type Platform = 'ios' | 'android' | 'desktop';

/**
 * Best-effort platform sniff from the UA string. Only used to pick which store
 * to offer — never to gate content — so a wrong guess just means the visitor
 * taps a badge instead of being redirected.
 */
export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  // iPadOS 13+ ships a desktop-Safari UA; multi-touch is what gives it away.
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return 'ios';
  return 'desktop';
}
