const workers = [
  { id: 1, name: 'Aysel', service: 'cleaning', rating: 4.8, jobs: 128, price: 18 },
  { id: 2, name: 'Nərmin', service: 'cooking', rating: 4.9, jobs: 94, price: 25 },
  { id: 3, name: 'Günel', service: 'both', rating: 4.7, jobs: 76, price: 30 },
  { id: 4, name: 'Rəna', service: 'cleaning', rating: 4.5, jobs: 53, price: 15 },
];

const bookings = [];
const ratings = [];
let selectedWorker = null;

const workerList = document.getElementById('workerList');
const serviceFilter = document.getElementById('serviceFilter');
const priceFilter = document.getElementById('priceFilter');
const priceValue = document.getElementById('priceValue');

const bookingModal = document.getElementById('bookingModal');
const bookingForm = document.getElementById('bookingForm');
const bookingDate = document.getElementById('bookingDate');
const bookingTime = document.getElementById('bookingTime');
const modalTitle = document.getElementById('modalTitle');

const ratingModal = document.getElementById('ratingModal');
const ratingForm = document.getElementById('ratingForm');
const ratingTitle = document.getElementById('ratingTitle');
const ratingValue = document.getElementById('ratingValue');
const ratingComment = document.getElementById('ratingComment');

const serviceLabel = {
  cleaning: 'Ev təmizliyi',
  cooking: 'Yemək bişirmə',
  both: 'Təmizlik + yemək',
};

function matchesFilter(worker) {
  const selectedService = serviceFilter.value;
  const maxPrice = Number(priceFilter.value);
  const serviceMatch =
    selectedService === 'all' ||
    worker.service === selectedService ||
    (selectedService !== 'both' && worker.service === 'both');

  return serviceMatch && worker.price <= maxPrice;
}

function renderWorkers() {
  const visibleWorkers = workers.filter(matchesFilter);
  workerList.innerHTML = '';

  if (!visibleWorkers.length) {
    workerList.innerHTML = '<p>Filtrə uyğun işçi tapılmadı.</p>';
    return;
  }

  visibleWorkers.forEach((worker) => {
    const card = document.createElement('article');
    card.className = 'worker-card';
    card.innerHTML = `
      <div class="worker-head">
        <strong>${worker.name}</strong>
        <span class="badge">⭐ ${worker.rating}</span>
      </div>
      <small>${serviceLabel[worker.service]} • ${worker.jobs} iş tamamlayıb</small>
      <div class="price">${worker.price} AZN / saat</div>
      <button data-id="${worker.id}" class="book-btn">Bron et</button>
    `;
    workerList.appendChild(card);
  });
}

workerList.addEventListener('click', (event) => {
  const button = event.target.closest('.book-btn');
  if (!button) {
    return;
  }

  selectedWorker = workers.find((worker) => worker.id === Number(button.dataset.id));
  modalTitle.textContent = `${selectedWorker.name} üçün bron`;
  bookingForm.reset();
  bookingModal.showModal();
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!selectedWorker) {
    return;
  }

  bookings.push({
    workerId: selectedWorker.id,
    date: bookingDate.value,
    time: bookingTime.value,
    status: 'completed',
  });

  bookingModal.close();

  ratingTitle.textContent = `${selectedWorker.name} üçün reytinq ver`;
  ratingForm.reset();
  ratingModal.showModal();
});

ratingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!selectedWorker) {
    return;
  }

  ratings.push({
    workerId: selectedWorker.id,
    stars: Number(ratingValue.value),
    comment: ratingComment.value,
  });

  const workerRatings = ratings
    .filter((rate) => rate.workerId === selectedWorker.id)
    .map((rate) => rate.stars);

  selectedWorker.rating = (
    workerRatings.reduce((acc, current) => acc + current, 0) / workerRatings.length
  ).toFixed(1);

  ratingModal.close();
  renderWorkers();
});

serviceFilter.addEventListener('change', renderWorkers);
priceFilter.addEventListener('input', () => {
  priceValue.textContent = `${priceFilter.value} AZN`;
  renderWorkers();
});

renderWorkers();
