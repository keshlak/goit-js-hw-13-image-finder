import './sass/main.scss';
import cardTmpl from './templates/card.hbs';
import ApiService from './js/apiService';

// Refs

const refs = {
  searchForm: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  photoCard: document.querySelector('.photo-card'),
};

class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRefs(selector);

    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};
    refs.button = document.querySelector(selector);
    refs.label = refs.button.querySelector('.label');

    return refs;
  }

  enable() {
    this.refs.button.disabled = false;
    this.refs.label.textContent = 'Load more';
  }

  disable() {
    this.refs.button.disabled = true;
    this.refs.label.textContent = 'Loading...';
  }

  show() {
    this.refs.button.classList.remove('is-hidden');
  }

  hide() {
    this.refs.button.classList.add('is-hidden');
  }
}

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const apiService = new ApiService();

refs.searchForm.addEventListener('submit', onInputChange);
loadMoreBtn.refs.button.addEventListener('click', fetchHits);

function onInputChange(event) {
  event.preventDefault();

  const form = event.currentTarget;
  apiService.query = form.elements.query.value;

  if (apiService.query.trim() === '') {
    return;
  }

  clearGallery();

  loadMoreBtn.show();
  apiService.resetPage();
  fetchHits();
}

function fetchHits() {
  loadMoreBtn.disable();
  apiService.fetchImages().then(hits => {
    appendHitsMarkup(hits);
    loadMoreBtn.enable();

    if (hits.length < 12) {
      loadMoreBtn.hide();
    }
  });
}

function appendHitsMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', cardTmpl(hits));
  loadMoreBtn.refs.button.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
