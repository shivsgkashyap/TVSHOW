const formElement = document.querySelector(".js-input-form");
const allTvShowsElement = document.querySelector(".tv-shows-all");
const inputBoxElement = document.querySelector(".js-input-form input");
let tvShowInformation = [];

function render() {
  let tvShowList = "";
  for (let counter = 0; counter < tvShowInformation.length; counter++) {
    let show = `
      <a href="showinfo.html?tvshow=${tvShowInformation[counter].id}">
        <div class="tv-show" data-counter="${counter}">
          <img src="${
            tvShowInformation[counter]["image"] === null
              ? "images/No-Image-Placeholder.svg.png"
              : tvShowInformation[counter]["image"]["medium"]
          }" />
          <div class="subtext">${
            tvShowInformation[counter]["name"] === null
              ? "Unknown Name"
              : tvShowInformation[counter]["name"]
          }</div>
          <div class="genre">${tvShowInformation[counter]["genres"]}</div>
        </div>
      </a>  
    `;

    tvShowList = tvShowList + show;
  }
  allTvShowsElement.innerHTML = tvShowList;
}

function loadShowAndRender() {
  const queryParams = new URLSearchParams(window.location.search);
  const showTitle = queryParams.get("showTitle");

  if (showTitle) {
    querySearch(showTitle).then((tvShow) => {
      tvShowInformation = tvShow;
      render();
    });
  } else {
    render();
  }
}

function addEventListenerToClass(cls, event, fn) {
  const elements = document.querySelectorAll(cls);

  for (var counter = 0; counter < elements.length; counter++) {
    elements[counter].addEventListener(event, fn);
  }
}

function removeEventListenerToClass(cls, event, fn) {
  const elements = document.querySelectorAll(cls);

  for (var counter = 0; counter < elements.length; counter++) {
    elements[counter].removeEventListener(event, fn);
  }
}

formElement.addEventListener("submit", function (eventData) {
  eventData.preventDefault();
  changeUrl(inputBoxElement.value);
});

function changeUrl(showTitle) {
  window.location.href = `showsearch.html?showTitle=${showTitle}`;
}

function querySearch(searchedShow) {
  const searchedShowURL =
    "https://api.tvmaze.com/search/shows?q=" + searchedShow;
  return fetch(searchedShowURL)
    .then((responseData) => responseData.json())
    .then((tvShows) =>
      tvShows.map(({ show: { id, name, genres, image } }) => ({
        id,
        name,
        genres,
        image,
      }))
    );
}

// Run app

loadShowAndRender();
