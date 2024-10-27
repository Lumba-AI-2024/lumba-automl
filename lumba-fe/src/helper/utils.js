import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getFromLocalStorage(key) {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function setToLocalStorage(key, item) {
  if (typeof window !== "undefined") {
    return window.localStorage.setItem(key, item);
  }
  return { key, item };
}
