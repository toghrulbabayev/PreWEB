import { STORAGE_KEYS } from '../config/constants.js';
import { getData, setData } from '../utils/storage.js';

export function seedIfNeeded() {
  const users = getUsers();
  if (!users.length) {
    saveUsers([
      { id: 1, name: 'Aysel', email: 'aysel@demo.az', password: '1234', role: 'provider' },
      { id: 2, name: 'Nermin', email: 'nermin@demo.az', password: '1234', role: 'provider' },
      { id: 3, name: 'Demo Customer', email: 'customer@demo.az', password: '1234', role: 'customer' },
    ]);
  }

  const workers = getWorkers();
  if (!workers.length) {
    saveWorkers([
      {
        id: 1,
        userId: 1,
        name: 'Aysel',
        service: 'cleaning',
        price: 20,
        bio: 'Detallı ev təmizliyi, steril və səliqəli iş.',
        ratingSum: 48,
        ratingCount: 10,
        jobs: 42,
      },
      {
        id: 2,
        userId: 2,
        name: 'Nermin',
        service: 'cooking',
        price: 28,
        bio: 'Ailə yeməkləri və diet menyu hazırlanması.',
        ratingSum: 36,
        ratingCount: 8,
        jobs: 31,
      },
    ]);
  }

  if (!getData(STORAGE_KEYS.bookings, null)) {
    saveBookings([]);
  }

  if (!getData(STORAGE_KEYS.ratings, null)) {
    saveRatings([]);
  }
}

export function getUsers() {
  return getData(STORAGE_KEYS.users, []);
}

export function saveUsers(users) {
  setData(STORAGE_KEYS.users, users);
}

export function getWorkers() {
  return getData(STORAGE_KEYS.workers, []);
}

export function saveWorkers(workers) {
  setData(STORAGE_KEYS.workers, workers);
}

export function getBookings() {
  return getData(STORAGE_KEYS.bookings, []);
}

export function saveBookings(bookings) {
  setData(STORAGE_KEYS.bookings, bookings);
}

export function getRatings() {
  return getData(STORAGE_KEYS.ratings, []);
}

export function saveRatings(ratings) {
  setData(STORAGE_KEYS.ratings, ratings);
}

export function getCurrentUserId() {
  return Number(localStorage.getItem(STORAGE_KEYS.currentUserId)) || null;
}

export function setCurrentUserId(id) {
  localStorage.setItem(STORAGE_KEYS.currentUserId, String(id));
}

export function clearCurrentUserId() {
  localStorage.removeItem(STORAGE_KEYS.currentUserId);
}
