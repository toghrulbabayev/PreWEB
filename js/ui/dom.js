export function getEls() {
  return {
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
}
