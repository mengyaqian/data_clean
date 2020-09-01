type Token = (string | undefined)

export const getStorage = (key: string): Token => localStorage.getItem(key) || undefined;

export const setStorage = (key: string,val: string): void => {
  localStorage.setItem(key, val);
};

export const clearStorage = (key: string): void => {
  localStorage.removeItem(key);
};