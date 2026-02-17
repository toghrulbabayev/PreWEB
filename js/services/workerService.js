import { getWorkers, saveWorkers } from '../state/store.js';

export function listWorkers() {
  return getWorkers();
}

export function getWorkerById(workerId) {
  return getWorkers().find((worker) => worker.id === workerId) || null;
}

export function upsertProviderProfile(userId, payload) {
  const workers = getWorkers();
  const existing = workers.find((worker) => worker.userId === userId);

  if (existing) {
    existing.name = payload.name.trim();
    existing.service = payload.service;
    existing.price = Number(payload.price);
    existing.bio = payload.bio.trim();
  } else {
    const nextId = workers.length ? Math.max(...workers.map((worker) => worker.id)) + 1 : 1;
    workers.push({
      id: nextId,
      userId,
      name: payload.name.trim(),
      service: payload.service,
      price: Number(payload.price),
      bio: payload.bio.trim(),
      ratingSum: 0,
      ratingCount: 0,
      jobs: 0,
    });
  }

  saveWorkers(workers);
}

export function incrementWorkerRating(workerId, stars) {
  const workers = getWorkers();
  const worker = workers.find((item) => item.id === workerId);
  if (!worker) {
    return;
  }

  worker.ratingSum += Number(stars);
  worker.ratingCount += 1;
  worker.jobs += 1;
  saveWorkers(workers);
}
