const resultsBox = document.querySelector('.results');
const searchBox = document.querySelector('.search-box');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('#search');
const searchResults = document.querySelectorAll('.search-result');
const tagBox = document.querySelector('.tags');

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const searchVal = searchInput.value
    .replace(/(?!\w|\s)./g, '')
    .replace(/\s+/g, ' ')
    .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2')
    .replace(' ', '+');
  if (searchVal !== '') {
    headerize();
    addTag(searchVal);
    getResults(searchVal);
    searchInput.value = '';
  }
});

function headerize() {
  TweenMax.set('.tags', { opacity: 0 });
  const tl = new TimelineMax();
  tl.to(searchBox, 0.2, { x: '-120vw' });
  tl.set(searchBox, { className: '+=headered' });
  tl.to(searchBox, 0.2, { x: 0 });
  tl.to('.tags', 0.3, { opacity: 1 });
  tl.play();
}
function addTag(phrase) {
  const tag = document.createElement('span');
  tag.classList.add('tag');
  tag.textContent = phrase;
  tagBox.appendChild(tag);
  tag.addEventListener('click', () => {
    getResults(phrase);
  });
}

function getResults(query) {
  resultsBox.innerHTML = '';
  fetch(
    `https://api.giphy.com/v1/gifs/search?q=${query}&api_key=bb2006d9d3454578be1a99cfad65913d&limit=10`
  )
    .then(resp => resp.json())
    .then(data => {
      console.log(data);
      data.data.forEach(gif => {
        const searchResult = document.createElement('div');
        searchResult.classList.add('search-result');
        const thumbnail = document.createElement('div');
        thumbnail.classList.add('thumbnail');
        thumbnail.style.backgroundImage = `url(${
          gif.images.original_still.url
        })`;
        searchResult.addEventListener('mouseenter', () => {
          thumbnail.style.backgroundImage = `url(${
            gif.images.fixed_height.url
          })`;
        });
        searchResult.addEventListener('mouseleave', () => {
          thumbnail.style.backgroundImage = `url(${
            gif.images.original_still.url
          })`;
        });
        searchResult.appendChild(thumbnail);
        resultsBox.append(searchResult);
        const details = document.createElement('div');
        details.classList.add('details');
        searchResult.appendChild(details);
        const title = document.createElement('h2');
        title.classList.add('gif-title');
        title.textContent = gif.title;
        details.appendChild(title);
        const rating = document.createElement('p');
        rating.classList.add('rating');
        rating.textContent = `Rated: ${gif.rating}`;
        details.appendChild(rating);
      });
      TweenMax.staggerTo('.search-result', 0.5, { x: '150vw' }, 0.2);
    })
    .catch(error => console.log(error));
  TweenMax.set('.results', { x: '-150vw' });
}
