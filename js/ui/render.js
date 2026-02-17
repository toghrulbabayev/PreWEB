import { SERVICE_LABEL } from '../config/constants.js';

export function averageRating(worker) {
  if (!worker.ratingCount) {
    return 'Yeni';
  }

  return (worker.ratingSum / worker.ratingCount).toFixed(1);
}

export function matchesFilter(worker, filterState) {
  const { service, maxPrice } = filterState;
  const serviceMatch =
    service === 'all' || worker.service === service || (service !== 'both' && worker.service === 'both');

  return serviceMatch && worker.price <= maxPrice;
}

export function renderWorkers(els, workers, filterState) {
  const filteredWorkers = workers.filter((worker) => matchesFilter(worker, filterState));
  els.workerList.innerHTML = '';

  if (!filteredWorkers.length) {
    els.workerList.innerHTML = '<p class="small-text">Filtrə uyğun işçi tapılmadı.</p>';
    return;
  }

  filteredWorkers.forEach((worker) => {
    const card = document.createElement('article');
    card.className = 'worker-card';
    card.innerHTML = `
      <div class="row">
        <strong>${worker.name}</strong>
        <span class="badge">⭐ ${averageRating(worker)}</span>
      </div>
      <small class="small-text">${SERVICE_LABEL[worker.service]} • ${worker.jobs} iş</small>
      <small>${worker.bio}</small>
      <div class="price">${worker.price} AZN / saat</div>
      <button class="primary book-btn" data-worker-id="${worker.id}">Bron et</button>
    `;
    els.workerList.appendChild(card);
  });
}

export function renderSession(els, user) {
  if (!user) {
    els.sessionInfo.textContent = 'Hal-hazırda guest olaraq baxırsınız.';
    els.signOutBtn.classList.add('hidden');
    els.openRegisterBtn.classList.remove('hidden');
    els.openSignInBtn.classList.remove('hidden');
    els.providerPanel.classList.add('hidden');
    els.bookingsSection.classList.add('hidden');
    return;
  }

  els.sessionInfo.textContent = `Daxil olunub: ${user.name} (${user.role})`;
  els.signOutBtn.classList.remove('hidden');
  els.openRegisterBtn.classList.add('hidden');
  els.openSignInBtn.classList.add('hidden');

  if (user.role === 'provider') {
    els.providerPanel.classList.remove('hidden');
    els.bookingsSection.classList.add('hidden');
  } else {
    els.providerPanel.classList.add('hidden');
    els.bookingsSection.classList.remove('hidden');
  }
}

export function renderProviderForm(els, profile) {
  if (!profile) {
    els.providerForm.reset();
    return;
  }

  els.providerName.value = profile.name;
  els.providerService.value = profile.service;
  els.providerPrice.value = profile.price;
  els.providerBio.value = profile.bio;
}

export function renderBookings(els, bookings, workers) {
  els.bookingsList.innerHTML = '';

  if (!bookings.length) {
    els.bookingsList.innerHTML = '<p class="small-text">Hələ bron yoxdur.</p>';
    return;
  }

  bookings.forEach((booking) => {
    const worker = workers.find((item) => item.id === booking.workerId);
    const row = document.createElement('div');
    row.className = 'row card';
    row.innerHTML = `
      <div>
        <strong>${worker ? worker.name : 'Naməlum'}</strong>
        <div class="small-text">${booking.date} ${booking.time} • status: ${booking.status}</div>
      </div>
      ${
        booking.status === 'booked'
          ? `<button class="primary complete-btn" data-booking-id="${booking.id}" data-worker-id="${booking.workerId}">Tamamlandı + Rate et</button>`
          : '<span class="badge">Başa çatıb</span>'
      }
    `;
    els.bookingsList.appendChild(row);
  });
}
