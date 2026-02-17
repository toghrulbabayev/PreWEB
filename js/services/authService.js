import {
  clearCurrentUserId,
  getCurrentUserId,
  getUsers,
  saveUsers,
  setCurrentUserId,
} from '../state/store.js';

export function getCurrentUser() {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) {
    return null;
  }

  return getUsers().find((user) => user.id === currentUserId) || null;
}

export function registerUser({ name, email, password, role }) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((user) => user.email === normalizedEmail)) {
    return { ok: false, message: 'Bu email artıq qeydiyyatdadır.' };
  }

  const nextId = users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1;
  const user = {
    id: nextId,
    name: name.trim(),
    email: normalizedEmail,
    password,
    role,
  };

  users.push(user);
  saveUsers(users);
  setCurrentUserId(user.id);
  return { ok: true, user };
}

export function signIn({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = getUsers().find((item) => item.email === normalizedEmail && item.password === password);

  if (!user) {
    return { ok: false, message: 'Email və ya şifrə yanlışdır.' };
  }

  setCurrentUserId(user.id);
  return { ok: true, user };
}

export function signOut() {
  clearCurrentUserId();
}
