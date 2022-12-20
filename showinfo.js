const savedTvShowId = new URLSearchParams(window.location.search).get("tvshow");
const tvShowElement = document.querySelector(".top-section");
const plotElement = document.querySelector(".plot");
const castListElement = document.querySelector(".cast-list");
const seasonsListElement = document.querySelector(".seasons-list");
let selectedTvShow = {};
let selectedCastInfo = [];
let selectedSeasonsInfo = [];
const favoriteObject = JSON.parse(localStorage.getItem("favorites"));
let isFavorite =
  favoriteObject === null ? false : favoriteObject[savedTvShowId];

function render() {
  removeEventListenerToClass(".fav-button", "click", onFavClick);

  let tvShowInformation = `
    <div class="back-button"d><a href="index.html">Home</a></div>  
    <div class="tv-show-image">
      <img src="${
        selectedTvShow["image"] === null
          ? "images/No-Image-Placeholder.svg.png"
          : selectedTvShow["image"]["medium"]
      }" />
    </div>
    <div class="tv-show-title">${
      selectedTvShow["name"] === null ? "Unknown Name" : selectedTvShow["name"]
    }</div>
    <button class="fav-button"><i class="${
      isFavorite ? "fas" : "far"
    } fa-star fa-2x"></i></button>
  `;
  tvShowElement.innerHTML = tvShowInformation;

  let plotInformation = ` <div class="plot-details">${selectedTvShow["summary"]}</div>
  `;
  plotElement.innerHTML = plotInformation;

  let allCastInfo = "";
  for (let counter = 0; counter < selectedCastInfo.length; counter++) {
    let castInformation = `
      <div class="cast-details" data-counter="${counter}">
          <img src="${
            selectedCastInfo[counter]["image"] === null
              ? "images/No-Image-Placeholder.svg.png"
              : selectedCastInfo[counter]["image"]["medium"]
          }" />
          <div class="cast-name">${
            selectedCastInfo[counter]["name"] === null
              ? "Unknown Name"
              : selectedCastInfo[counter]["name"]
          }</div>
        </div>
    `;

    allCastInfo = allCastInfo + castInformation;
  }
  castListElement.innerHTML = allCastInfo;

  let allSeasonsInfo = "";
  for (let counter = 0; counter < selectedSeasonsInfo.length; counter++) {
    let seasonsInformation = `
      <div class="seasons-details" data-counter="${counter}">
          <img src="${
            selectedSeasonsInfo[counter]["image"] === null
              ? "images/No-Image-Placeholder.svg.png"
              : selectedSeasonsInfo[counter]["image"]["medium"]
          }" />
          <div class="seasons-name">${
            selectedSeasonsInfo[counter]["number"] === null
              ? "Unknown"
              : selectedSeasonsInfo[counter]["number"]
          }</div>
        </div>
    `;

    allSeasonsInfo = allSeasonsInfo + seasonsInformation;
  }
  seasonsListElement.innerHTML = allSeasonsInfo;

  addEventListenerToClass(".fav-button", "click", onFavClick);
}

function addEventListenerToClass(cls, event, fn) {
  let element = document.querySelector(cls);
  element.addEventListener(event, fn);
}

function removeEventListenerToClass(cls, event, fn) {
  let element = document.querySelector(cls);
  if (element !== null) {
    element.removeEventListener(event, fn);
  }
}

queryRetrieve(savedTvShowId).then((tvShow) => {
  selectedTvShow = tvShow;
  render();
});

castRetrieve(savedTvShowId).then((castInfo) => {
  selectedCastInfo = castInfo;
  render();
});

seasonsRetrieve(savedTvShowId).then((seasonsInfo) => {
  selectedSeasonsInfo = seasonsInfo;
  render();
});

function setFavorite(bool) {
  let favoriteObject = JSON.parse(localStorage.getItem("favorites"));
  if (favoriteObject === null) {
    favoriteObject = { savedTvShowId: bool };
  } else {
    favoriteObject[savedTvShowId] = bool;
  }
  localStorage.setItem("favorites", JSON.stringify(favoriteObject));
  isFavorite = bool;
}

function onFavClick(eventData) {
  isFavorite = !isFavorite;
  setFavorite(isFavorite);
  render();
}

function queryRetrieve(searchedShow) {
  const searchedShowURL = "https://api.tvmaze.com/shows/" + searchedShow;
  return fetch(searchedShowURL)
    .then((responseData) => responseData.json())
    .then((tvShows) => {
      let tempShowInfo = "";
      let tvShowsDataAll = tvShows;
      let tvShowsDataDesired = (({ name, image, summary }) => ({
        name,
        image,
        summary,
      }))(tvShowsDataAll);

      tempShowInfo = tvShowsDataDesired;

      return tempShowInfo;
    });
}

function castRetrieve(showId) {
  const searchedCastURL = "https://api.tvmaze.com/shows/" + showId + "/cast";
  return fetch(searchedCastURL)
    .then((responseData) => responseData.json())
    .then((castInfo) => {
      let tempCastList = [];
      for (let index = 0; index < castInfo.length; index++) {
        let castDataAll = castInfo[index]["person"];
        let castDataDesired = (({ name, image }) => ({
          name,
          image,
        }))(castDataAll);
        tempCastList.push(castDataDesired);
      }
      return tempCastList;
    });
}

function seasonsRetrieve(showId) {
  const searchedSeasonsURL =
    "https://api.tvmaze.com/shows/" + showId + "/seasons";
  return fetch(searchedSeasonsURL)
    .then((responseData) => responseData.json())
    .then((seasonsInfo) => {
      let tempSeasonsList = [];
      for (let index = 0; index < seasonsInfo.length; index++) {
        let seasonsDataAll = seasonsInfo[index];
        let seasonsDataDesired = (({ number, image }) => ({
          number,
          image,
        }))(seasonsDataAll);
        tempSeasonsList.push(seasonsDataDesired);
      }
      return tempSeasonsList;
    });
}
