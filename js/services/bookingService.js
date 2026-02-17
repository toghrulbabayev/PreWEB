import { getBookings, getRatings, saveBookings, saveRatings } from '../state/store.js';

export function listBookingsByCustomer(customerId) {
  return getBookings().filter((booking) => booking.customerId === customerId);
}

export function createBooking({ workerId, customerId, date, time }) {
  const bookings = getBookings();
  const nextId = bookings.length ? Math.max(...bookings.map((booking) => booking.id)) + 1 : 1;

  bookings.push({
    id: nextId,
    workerId,
    customerId,
    date,
    time,
    status: 'booked',
  });

  saveBookings(bookings);
}

export function completeBookingAndRate({ bookingId, workerId, customerId, stars, comment }) {
  const ratings = getRatings();
  const nextId = ratings.length ? Math.max(...ratings.map((item) => item.id)) + 1 : 1;

  ratings.push({
    id: nextId,
    workerId,
    customerId,
    stars: Number(stars),
    comment: comment.trim(),
  });
  saveRatings(ratings);

  const bookings = getBookings();
  const booking = bookings.find((item) => item.id === bookingId);
  if (booking) {
    booking.status = 'completed';
    saveBookings(bookings);
  }
}
