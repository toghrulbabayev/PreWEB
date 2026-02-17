const STORAGE_KEYS = {
  users: 'evusta_users',
  workers: 'evusta_workers',
  bookings: 'evusta_bookings',
  ratings: 'evusta_ratings',
  currentUserId: 'evusta_current_user_id',
};

const serviceLabel = {
  cleaning: 'Ev təmizliyi',
  cooking: 'Yemək bişirmə',
  both: 'Təmizlik + yemək',
};

function getData(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function seedIfNeeded() {
  const users = getData(STORAGE_KEYS.users, []);
  if (!users.length) {
    const seededUsers = [
      { id: 1, name: 'Aysel', email: 'aysel@demo.az', password: '1234', role: 'provider' },
      { id: 2, name: 'Nermin', email: 'nermin@demo.az', password: '1234', role: 'provider' },
      { id: 3, name: 'Demo Customer', email: 'customer@demo.az', password: '1234', role: 'customer' },
    ];
    setData(STORAGE_KEYS.users, seededUsers);
  }

  const workers = getData(STORAGE_KEYS.workers, []);
  if (!workers.length) {
    setData(STORAGE_KEYS.workers, [
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
    setData(STORAGE_KEYS.bookings, []);
  }

  if (!getData(STORAGE_KEYS.ratings, null)) {
    setData(STORAGE_KEYS.ratings, []);
  }
}

seedIfNeeded();

const els = {
  workerList: document.getElementById('workerList'),
  serviceFilter: document.getElementById('serviceFilter'),
  priceFilter: document.getElementById('priceFilter'),
  priceValue: document.getElementById('priceValue'),
  sessionInfo: document.getElementById('sessionInfo'),

  openRegisterBtn: document.getElementById('openRegisterBtn'),
  openSignInBtn: document.getElementById('openSignInBtn'),
  signOutBtn: document.getElementById('signOutBtn'),

  registerModal: document.getElementById('registerModal'),
  registerForm: document.getElementById('registerForm'),
  registerName: document.getElementById('registerName'),
  registerEmail: document.getElementById('registerEmail'),
  registerPassword: document.getElementById('registerPassword'),
  registerRole: document.getElementById('registerRole'),

  signInModal: document.getElementById('signInModal'),
  signInForm: document.getElementById('signInForm'),
  signInEmail: document.getElementById('signInEmail'),
  signInPassword: document.getElementById('signInPassword'),

  providerPanel: document.getElementById('providerPanel'),
  providerForm: document.getElementById('providerForm'),
  providerName: document.getElementById('providerName'),
  providerService: document.getElementById('providerService'),
  providerPrice: document.getElementById('providerPrice'),
  providerBio: document.getElementById('providerBio'),

  bookingsSection: document.getElementById('bookingsSection'),
  bookingsList: document.getElementById('bookingsList'),

  bookingModal: document.getElementById('bookingModal'),
  bookingForm: document.getElementById('bookingForm'),
  bookingTitle: document.getElementById('bookingTitle'),
  bookingDate: document.getElementById('bookingDate'),
  bookingTime: document.getElementById('bookingTime'),

  ratingModal: document.getElementById('ratingModal'),
  ratingForm: document.getElementById('ratingForm'),
  ratingTitle: document.getElementById('ratingTitle'),
  ratingValue: document.getElementById('ratingValue'),
  ratingComment: document.getElementById('ratingComment'),
};

let selectedWorkerId = null;
let selectedBookingId = null;

function getUsers() {
  return getData(STORAGE_KEYS.users, []);
}

function getWorkers() {
  return getData(STORAGE_KEYS.workers, []);
}

function getBookings() {
  return getData(STORAGE_KEYS.bookings, []);
}

function getCurrentUser() {
  const id = Number(localStorage.getItem(STORAGE_KEYS.currentUserId));
  if (!id) {
    return null;
  }
  return getUsers().find((user) => user.id === id) || null;
}

function saveUsers(users) {
  setData(STORAGE_KEYS.users, users);
}

function saveWorkers(workers) {
  setData(STORAGE_KEYS.workers, workers);
}

function saveBookings(bookings) {
  setData(STORAGE_KEYS.bookings, bookings);
}

function averageRating(worker) {
  if (!worker.ratingCount) {
    return 'Yeni';
  }
  return (worker.ratingSum / worker.ratingCount).toFixed(1);
}

function matchesFilter(worker) {
  const service = els.serviceFilter.value;
  const maxPrice = Number(els.priceFilter.value);
  const serviceMatch =
    service === 'all' || worker.service === service || (service !== 'both' && worker.service === 'both');
  return serviceMatch && worker.price <= maxPrice;
}

function renderWorkers() {
  const workers = getWorkers().filter(matchesFilter);
  els.workerList.innerHTML = '';

  if (!workers.length) {
    els.workerList.innerHTML = '<p class="small-text">Filtrə uyğun işçi tapılmadı.</p>';
    return;
  }

  workers.forEach((worker) => {
    const card = document.createElement('article');
    card.className = 'worker-card';
    card.innerHTML = `
      <div class="row">
        <strong>${worker.name}</strong>
        <span class="badge">⭐ ${averageRating(worker)}</span>
      </div>
      <small class="small-text">${serviceLabel[worker.service]} • ${worker.jobs} iş</small>
      <small>${worker.bio}</small>
      <div class="price">${worker.price} AZN / saat</div>
      <button class="primary book-btn" data-worker-id="${worker.id}">Bron et</button>
    `;
    els.workerList.appendChild(card);
  });
}

function renderSession() {
  const user = getCurrentUser();
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
    const profile = getWorkers().find((worker) => worker.userId === user.id);
    if (profile) {
      els.providerName.value = profile.name;
      els.providerService.value = profile.service;
      els.providerPrice.value = profile.price;
      els.providerBio.value = profile.bio;
    } else {
      els.providerForm.reset();
    }
  } else {
    els.providerPanel.classList.add('hidden');
    els.bookingsSection.classList.remove('hidden');
    renderBookings();
  }
}

function renderBookings() {
  const user = getCurrentUser();
  if (!user || user.role !== 'customer') {
    return;
  }

  const bookings = getBookings().filter((booking) => booking.customerId === user.id);
  const workers = getWorkers();

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

function openBooking(workerId) {
  const user = getCurrentUser();
  if (!user || user.role !== 'customer') {
    alert('Bron üçün customer hesabı ilə daxil olmalısınız.');
    return;
  }

  const worker = getWorkers().find((item) => item.id === workerId);
  if (!worker) {
    return;
  }

  selectedWorkerId = workerId;
  els.bookingTitle.textContent = `${worker.name} üçün bron`;
  els.bookingForm.reset();
  els.bookingModal.showModal();
}

function registerUser(event) {
  event.preventDefault();
  const users = getUsers();
  const email = els.registerEmail.value.trim().toLowerCase();

  if (users.some((user) => user.email === email)) {
    alert('Bu email artıq qeydiyyatdadır.');
    return;
  }

  const nextId = users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1;
  const user = {
    id: nextId,
    name: els.registerName.value.trim(),
    email,
    password: els.registerPassword.value,
    role: els.registerRole.value,
  };

  users.push(user);
  saveUsers(users);
  localStorage.setItem(STORAGE_KEYS.currentUserId, String(user.id));
  els.registerModal.close();
  renderSession();
  renderWorkers();
}

function signIn(event) {
  event.preventDefault();
  const email = els.signInEmail.value.trim().toLowerCase();
  const password = els.signInPassword.value;
  const user = getUsers().find((item) => item.email === email && item.password === password);

  if (!user) {
    alert('Email və ya şifrə yanlışdır.');
    return;
  }

  localStorage.setItem(STORAGE_KEYS.currentUserId, String(user.id));
  els.signInModal.close();
  renderSession();
  renderWorkers();
}

function signOut() {
  localStorage.removeItem(STORAGE_KEYS.currentUserId);
  renderSession();
  renderWorkers();
}

function saveProviderProfile(event) {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user || user.role !== 'provider') {
    return;
  }

  const workers = getWorkers();
  const existing = workers.find((worker) => worker.userId === user.id);

  if (existing) {
    existing.name = els.providerName.value.trim();
    existing.service = els.providerService.value;
    existing.price = Number(els.providerPrice.value);
    existing.bio = els.providerBio.value.trim();
  } else {
    const nextId = workers.length ? Math.max(...workers.map((worker) => worker.id)) + 1 : 1;
    workers.push({
      id: nextId,
      userId: user.id,
      name: els.providerName.value.trim(),
      service: els.providerService.value,
      price: Number(els.providerPrice.value),
      bio: els.providerBio.value.trim(),
      ratingSum: 0,
      ratingCount: 0,
      jobs: 0,
    });
  }

  saveWorkers(workers);
  alert('Profil yadda saxlanıldı.');
  renderWorkers();
}

function submitBooking(event) {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user || user.role !== 'customer' || !selectedWorkerId) {
    return;
  }

  const bookings = getBookings();
  const nextId = bookings.length ? Math.max(...bookings.map((booking) => booking.id)) + 1 : 1;

  bookings.push({
    id: nextId,
    workerId: selectedWorkerId,
    customerId: user.id,
    date: els.bookingDate.value,
    time: els.bookingTime.value,
    status: 'booked',
  });

  saveBookings(bookings);
  els.bookingModal.close();
  renderBookings();
}

function openRating(bookingId, workerId) {
  selectedBookingId = bookingId;
  selectedWorkerId = workerId;
  const worker = getWorkers().find((item) => item.id === workerId);
  els.ratingTitle.textContent = `${worker ? worker.name : ''} üçün reytinq ver`;
  els.ratingForm.reset();
  els.ratingModal.showModal();
}

function submitRating(event) {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user || user.role !== 'customer' || !selectedWorkerId || !selectedBookingId) {
    return;
  }

  const ratings = getData(STORAGE_KEYS.ratings, []);
  const nextRatingId = ratings.length ? Math.max(...ratings.map((rate) => rate.id)) + 1 : 1;
  ratings.push({
    id: nextRatingId,
    workerId: selectedWorkerId,
    customerId: user.id,
    stars: Number(els.ratingValue.value),
    comment: els.ratingComment.value.trim(),
  });
  setData(STORAGE_KEYS.ratings, ratings);

  const workers = getWorkers();
  const worker = workers.find((item) => item.id === selectedWorkerId);
  if (worker) {
    worker.ratingSum += Number(els.ratingValue.value);
    worker.ratingCount += 1;
    worker.jobs += 1;
    saveWorkers(workers);
  }

  const bookings = getBookings();
  const booking = bookings.find((item) => item.id === selectedBookingId);
  if (booking) {
    booking.status = 'completed';
    saveBookings(bookings);
  }

  els.ratingModal.close();
  renderBookings();
  renderWorkers();
}

els.openRegisterBtn.addEventListener('click', () => {
  els.registerForm.reset();
  els.registerModal.showModal();
});

els.openSignInBtn.addEventListener('click', () => {
  els.signInForm.reset();
  els.signInModal.showModal();
});

els.signOutBtn.addEventListener('click', signOut);
els.registerForm.addEventListener('submit', registerUser);
els.signInForm.addEventListener('submit', signIn);
els.providerForm.addEventListener('submit', saveProviderProfile);
els.bookingForm.addEventListener('submit', submitBooking);
els.ratingForm.addEventListener('submit', submitRating);

els.serviceFilter.addEventListener('change', renderWorkers);
els.priceFilter.addEventListener('input', () => {
  els.priceValue.textContent = `${els.priceFilter.value} AZN`;
  renderWorkers();
});

els.workerList.addEventListener('click', (event) => {
  const button = event.target.closest('.book-btn');
  if (!button) {
    return;
  }
  openBooking(Number(button.dataset.workerId));
});

els.bookingsList.addEventListener('click', (event) => {
  const button = event.target.closest('.complete-btn');
  if (!button) {
    return;
  }
  openRating(Number(button.dataset.bookingId), Number(button.dataset.workerId));
});

renderSession();
renderWorkers();
