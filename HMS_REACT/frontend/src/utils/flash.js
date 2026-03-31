const FLASH_KEY = 'mediuFlash';

export function setFlashMessage(message, variant = 'success') {
  sessionStorage.setItem(FLASH_KEY, JSON.stringify({ message, variant }));
}

export function consumeFlashMessage() {
  const raw = sessionStorage.getItem(FLASH_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(FLASH_KEY);
  return JSON.parse(raw);
}
