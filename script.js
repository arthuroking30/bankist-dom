'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollto = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const sections = document.querySelectorAll('.section');
const tabsContainer = document.querySelector('.operations__tab-container');
const navLinks = document.querySelector('.nav__links');
const navLink = document.querySelectorAll('.nav__link');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const featuresImages = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const dotsContainer = document.querySelector('.dots');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
//hide sections
sections.forEach(section => section.classList.add('section--hidden'));

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///scroll to
btnScrollto.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

////////////////////////// Page Navigation
navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  // if (!e.target.getAttribute('href')) return;
  if (!e.target.classList.contains('nav__link')) return;
  const section = document.querySelector(e.target.getAttribute('href'));
  section.scrollIntoView({ behavior: 'smooth' });
});

/////hover effect nav
const handleHover = function (e) {
  if (!e.target.classList.contains('nav__link')) return;
  const link = e.target;
  const siblings = link.closest('.nav').querySelectorAll('.nav__link');
  const logo = link.closest('.nav').querySelector('img');
  ///unfocus all elements;
  siblings.forEach(link => (link.style.opacity = this));
  logo.style.opacity = this;
  //focus target;
  link.style.opacity = 1;
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

/////nav sticky
///old
// const distanceToElement = section1.getBoundingClientRect().top;
// window.addEventListener('scroll', function (e) {
//   if (this.scrollY > distanceToElement) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
//   // console.log(distanceToElement);
// });

//new
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(document.querySelector('.header'));

/////lazyload sections
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
sections.forEach(section => sectionObserver.observe(section));

////lazyLoad images
const revealImage = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //load image;
  entry.target.src = '' + entry.target.dataset.src;
  //remove blurr after image is downloaded
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );
  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(revealImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
featuresImages.forEach(image => imageObserver.observe(image));

//////tabs
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  //make all buttons innactive;
  tabs.forEach(btn => btn.classList.remove('operations__tab--active'));
  //activate the right button
  clicked.classList.add('operations__tab--active');
  //make all operation content inactive
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  //getdata and make right tab active
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////Carousel
let HTML = '';
//set pages;
slides.forEach((slide, i) => {
  //set transform
  slide.style.transform = `translateX(${i * 100}%)`;
});

const changePage = function (page) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - page) * 100}%)`;
  });
};

let page = 0;
const numSlides = slides.length - 1;

const changePageNext = function () {
  if (page >= numSlides) {
    page = 0;
  } else page++;
  changePage(page);
  activateDot(page);
};
const changePagePrev = function () {
  if (page <= 0) {
    page = numSlides;
  } else page--;
  changePage(page);
  activateDot(page);
};

//dots

const activateDot = function (index) {
  const dots = [...dotsContainer.children];
  dots.forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });
  document
    .querySelector(`.dots__dot[data-index='${index}']`)
    .classList.add('dots__dot--active');
};

//initialization
slides.forEach((_, i) => {
  dotsContainer.insertAdjacentHTML(
    'beforeend',
    `<div class="dots__dot" data-index='${i}'></div> \n`
  );
});
activateDot(page);

dotsContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  page = +e.target.dataset.index;
  changePage(page);
  //change dot
  activateDot(page);
});

btnRight.addEventListener('click', changePageNext);
btnLeft.addEventListener('click', changePagePrev);

//keyboard event
document.addEventListener('keydown', function (e) {
  if (e.code === 'ArrowLeft') changePagePrev();
  if (e.code === 'ArrowRight') changePageNext();
});
