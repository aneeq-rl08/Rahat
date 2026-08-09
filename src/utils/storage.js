// localStorage utilities

export const StorageKeys = {
  SELECTED_MOOD: 'rahat_selected_mood',
  POMODORO_STATE: 'rahat_pomodoro_state',
  UNLOCKED_BADGES: 'rahat_unlocked_badges',
  CUSTOM_BADGES: 'rahat_custom_badges',
  WISH_GARDEN_CLICKS: 'rahat_wish_garden_clicks',
  CUSTOM_TIMERS: 'rahat_custom_timers',
  CUSTOM_TIMER_DELETE_CONFIRM: 'rahat_custom_timer_delete_confirm',
  BIRTHDAY_NOTIFICATION_SEEN: 'rahat_birthday_notification_seen'
};

export function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error);
    return defaultValue;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key ${key}:`, error);
    return false;
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage key ${key}:`, error);
    return false;
  }
}

// Specific helpers
export function getSelectedMood() {
  return getItem(StorageKeys.SELECTED_MOOD);
}

export function setSelectedMood(mood) {
  return setItem(StorageKeys.SELECTED_MOOD, mood);
}

export function getPomodoroState() {
  return getItem(StorageKeys.POMODORO_STATE, {
    selectedDuration: 25,
    isRunning: false,
    timeRemaining: 25 * 60,
    completedSessions: 0
  });
}

export function setPomodoroState(state) {
  return setItem(StorageKeys.POMODORO_STATE, state);
}

export function getUnlockedBadges() {
  return getItem(StorageKeys.UNLOCKED_BADGES, []);
}

export function unlockBadge(badgeId) {
  const unlocked = getUnlockedBadges();
  if (!unlocked.includes(badgeId)) {
    unlocked.push(badgeId);
    setItem(StorageKeys.UNLOCKED_BADGES, unlocked);
  }
}

export function getCustomBadges() {
  return getItem(StorageKeys.CUSTOM_BADGES, []);
}

export function addCustomBadge(badge) {
  const customBadges = getCustomBadges();
  customBadges.push(badge);
  setItem(StorageKeys.CUSTOM_BADGES, customBadges);
}

export function getWishGardenClicks() {
  return getItem(StorageKeys.WISH_GARDEN_CLICKS, {
    white: 0,
    yellow: 0,
    blue: 0
  });
}

export function incrementWishGardenClick(color) {
  const clicks = getWishGardenClicks();
  clicks[color] = (clicks[color] || 0) + 1;
  setItem(StorageKeys.WISH_GARDEN_CLICKS, clicks);
}

export function getCustomTimers() {
  return getItem(StorageKeys.CUSTOM_TIMERS, []);
}

export function addCustomTimer(durationInSeconds) {
  const customTimers = getCustomTimers();
  // Avoid duplicates (within 1 second tolerance)
  const exists = customTimers.some(d => Math.abs(d - durationInSeconds) < 1);
  if (!exists && durationInSeconds > 0 && durationInSeconds <= 86400) { // Max 24 hours
    customTimers.push(durationInSeconds);
    // Sort in ascending order
    customTimers.sort((a, b) => a - b);
    setItem(StorageKeys.CUSTOM_TIMERS, customTimers);
    return true;
  }
  return false;
}

export function removeCustomTimer(duration) {
  const customTimers = getCustomTimers();
  const filtered = customTimers.filter(d => d !== duration);
  setItem(StorageKeys.CUSTOM_TIMERS, filtered);
}

export function getCustomTimerDeleteConfirm() {
  // Default to true (ask for confirmation) if key is missing or unreadable
  const value = getItem(StorageKeys.CUSTOM_TIMER_DELETE_CONFIRM, true);
  return typeof value === 'boolean' ? value : true;
}

export function setCustomTimerDeleteConfirm(shouldConfirm) {
  return setItem(StorageKeys.CUSTOM_TIMER_DELETE_CONFIRM, !!shouldConfirm);
}

export function getBirthdayNotificationSeen() {
  return getItem(StorageKeys.BIRTHDAY_NOTIFICATION_SEEN, false);
}

export function setBirthdayNotificationSeen(seen = true) {
  return setItem(StorageKeys.BIRTHDAY_NOTIFICATION_SEEN, seen);
}



