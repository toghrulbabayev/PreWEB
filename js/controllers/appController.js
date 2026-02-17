import { getEls } from '../ui/dom.js';
import {
  renderBookings,
  renderProviderForm,
  renderSession,
  renderWorkers,
} from '../ui/render.js';
import { seedIfNeeded } from '../state/store.js';
import { getCurrentUser, registerUser, signIn, signOut } from '../services/authService.js';
import {
  completeBookingAndRate,
  createBooking,
  listBookingsByCustomer,
} from '../services/bookingService.js';
import {
  getWorkerById,
  incrementWorkerRating,
  listWorkers,
  upsertProviderProfile,
} from '../services/workerService.js';

export function createAppController() {
  seedIfNeeded();

  const els = getEls();
  const state = {
    selectedWorkerId: null,
    selectedBookingId: null,
  };

  function getFilterState() {
    return {
      service: els.serviceFilter.value,
      maxPrice: Number(els.priceFilter.value),
    };
  }

  function refreshWorkers() {
    renderWorkers(els, listWorkers(), getFilterState());
  }

  function refreshBookings() {
    const user = getCurrentUser();
    if (!user || user.role !== 'customer') {
      return;
    }

    const bookings = listBookingsByCustomer(user.id);
    renderBookings(els, bookings, listWorkers());
  }

  function refreshSession() {
    const user = getCurrentUser();
    renderSession(els, user);

    if (!user) {
      return;
    }

    if (user.role === 'provider') {
      const profile = listWorkers().find((worker) => worker.userId === user.id) || null;
      renderProviderForm(els, profile);
    } else {
      refreshBookings();
    }
  }

  function handleRegister(event) {
    event.preventDefault();

    const result = registerUser({
      name: els.registerName.value,
      email: els.registerEmail.value,
      password: els.registerPassword.value,
      role: els.registerRole.value,
    });

    if (!result.ok) {
      alert(result.message);
      return;
    }

    els.registerModal.close();
    refreshSession();
    refreshWorkers();
  }

  function handleSignIn(event) {
    event.preventDefault();

    const result = signIn({
      email: els.signInEmail.value,
      password: els.signInPassword.value,
    });

    if (!result.ok) {
      alert(result.message);
      return;
    }

    els.signInModal.close();
    refreshSession();
    refreshWorkers();
  }

  function handleSignOut() {
    signOut();
    refreshSession();
    refreshWorkers();
  }

  function handleProviderSave(event) {
    event.preventDefault();

    const user = getCurrentUser();
    if (!user || user.role !== 'provider') {
      return;
    }

    upsertProviderProfile(user.id, {
      name: els.providerName.value,
      service: els.providerService.value,
      price: els.providerPrice.value,
      bio: els.providerBio.value,
    });

    alert('Profil yadda saxlanıldı.');
    refreshWorkers();
  }

  function openBooking(workerId) {
    const user = getCurrentUser();
    if (!user || user.role !== 'customer') {
      alert('Bron üçün customer hesabı ilə daxil olmalısınız.');
      return;
    }

    const worker = getWorkerById(workerId);
    if (!worker) {
      return;
    }

    state.selectedWorkerId = workerId;
    els.bookingTitle.textContent = `${worker.name} üçün bron`;
    els.bookingForm.reset();
    els.bookingModal.showModal();
  }

  function handleBookingSubmit(event) {
    event.preventDefault();

    const user = getCurrentUser();
    if (!user || user.role !== 'customer' || !state.selectedWorkerId) {
      return;
    }

    createBooking({
      workerId: state.selectedWorkerId,
      customerId: user.id,
      date: els.bookingDate.value,
      time: els.bookingTime.value,
    });

    els.bookingModal.close();
    refreshBookings();
  }

  function openRating(bookingId, workerId) {
    state.selectedBookingId = bookingId;
    state.selectedWorkerId = workerId;

    const worker = getWorkerById(workerId);
    els.ratingTitle.textContent = `${worker ? worker.name : ''} üçün reytinq ver`;
    els.ratingForm.reset();
    els.ratingModal.showModal();
  }

  function handleRatingSubmit(event) {
    event.preventDefault();

    const user = getCurrentUser();
    if (!user || user.role !== 'customer' || !state.selectedBookingId || !state.selectedWorkerId) {
      return;
    }

    const stars = Number(els.ratingValue.value);

    completeBookingAndRate({
      bookingId: state.selectedBookingId,
      workerId: state.selectedWorkerId,
      customerId: user.id,
      stars,
      comment: els.ratingComment.value,
    });

    incrementWorkerRating(state.selectedWorkerId, stars);

    els.ratingModal.close();
    refreshBookings();
    refreshWorkers();
  }

  function bindEvents() {
    els.openRegisterBtn.addEventListener('click', () => {
      els.registerForm.reset();
      els.registerModal.showModal();
    });

    els.openSignInBtn.addEventListener('click', () => {
      els.signInForm.reset();
      els.signInModal.showModal();
    });

    els.signOutBtn.addEventListener('click', handleSignOut);
    els.registerForm.addEventListener('submit', handleRegister);
    els.signInForm.addEventListener('submit', handleSignIn);
    els.providerForm.addEventListener('submit', handleProviderSave);
    els.bookingForm.addEventListener('submit', handleBookingSubmit);
    els.ratingForm.addEventListener('submit', handleRatingSubmit);

    els.serviceFilter.addEventListener('change', refreshWorkers);
    els.priceFilter.addEventListener('input', () => {
      els.priceValue.textContent = `${els.priceFilter.value} AZN`;
      refreshWorkers();
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
  }

  function init() {
    bindEvents();
    refreshSession();
    refreshWorkers();
  }

  return { init };
}
