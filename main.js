let basisUrl = "https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0";
let pokeFirstURL = "https://pokeapi.co/api/v2/pokemon/"


let pokeArrayAll = [];
let pokeArraysingle = [];
let pokemonsLoad = 24;
let pokeLoadMax = 0;
let pokeIndexAkt = 0;
let pokeSelection = [];
let colorCardList =
{
  grass: "#78C850",
  fire: "#F08030",
  wate: "#6890F0",
  bug: "#A8B820",
  normal: "#A8A878",
  poison: "#A040A0",
  electric: "#F8D030",
  ground: "#E0C068",
  flying: '#A890F0',
  ice: '#98D8D8',
  fighting: '#C03028',
  psychic: '#F85888',
  dark: '#705848',
  fairy: '#F0B6BC',
  rock: '#B8A038',
  bug: '#A8B820',
  dragon: '#7038F8',
  ghost: '#705898',
  steel: '#B8B8D0',
}




function init() {
  eventListener();
  loadAPIAllIndex();
  pokeNextSelection();
}

async function loadAPIAllIndex() {
  let responeAllpoke = await fetch(basisUrl);
  pokeArrayAll = (await responeAllpoke.json());
  console.log("AllPoket ", pokeArrayAll);
}


function searchPokemon() {
  let searchString = document.getElementById('searchField').value.trim();
  if (searchString.length < 3) {
    return;
  }
  document.getElementById('btnnext').style.display = 'none';
  let resultPokeSearch = [];
  let pokeSearch = pokeArrayAll.results.filter(p => p.name.toLowerCase().startsWith(searchString.toLowerCase()));
  console.log("Gefunden Arra", pokeSearch);
  pokeSearch.map(p => {
    let id = p.url.split("/").filter(part => part).pop();
    resultPokeSearch.push(id);
  });
  document.getElementById('poketCard').innerHTML = "";
  loadPokeSelect(resultPokeSearch);
}



function pokeNextSelection() {
  pokeSelection = [];
  let pokeIndexOld = pokeIndexAkt;
  pokeLoadMax = pokeLoadMax + pokemonsLoad;
  pokeIndexAkt = pokeIndexAkt + pokemonsLoad;
  console.log("IndexAktuell", pokeIndexAkt);
  console.log("polemonmax", pokeLoadMax);
  for (i = pokeIndexOld; i < pokeLoadMax; i++) {
    pokeSelection.push(i + 1);
  }
  console.log("pokeSelection == ", pokeSelection);
  loadPokeSelect(pokeSelection);
  document.getElementById('btnnext').style.display = 'flex';
}


async function loadPokeSelect(pokeSelec) {
  loader(true);
  try {
    const pokets = pokeSelec.map(id => `${pokeFirstURL}${id}`);
    let fetchPromis = pokets.map(singleURL => fetch(singleURL).then(Poketresponse => {
      return Poketresponse.json();
    }));
    pokeArraysingle = await Promise.all(fetchPromis)

  } catch {
    console.log("Fehler beim abrufen der Daten");
  } finally {
    console.log("Finally");
    renderPokeCard(pokeArraysingle);
  }
}


function renderPokeCard(poketList) {
  let i = -1;
  let element = document.getElementById('poketCard');
  let pokemonDetail = poketList.map(pokemon => {
    i = i + 1
    console.log(i);
    let img = pokeArraysingle[i].sprites.other.home.front_default;
    let pokType = typeCheck(pokemon);
    let colorCard = colorCardCheck(pokType[0]);
    element.innerHTML += templatePokeCard(pokemon, img, pokType, colorCard)
  })
  document.getElementById('btnnext').classList.remove('d-none');
  loader(false);
}


function typeCheck(Poklist) {
  let typesLenght = Poklist.types.filter(item => item.hasOwnProperty('slot')).length;
  let typesArray = [];
  if (typesLenght > 1) {
    return typesArray = [Poklist.types[0].type.name, Poklist.types[1].type.name];
  } else {
    return typesArray = [Poklist.types[0].type.name, "none"];
  }
}


function colorCardCheck(type) {
  let colorCode = colorCardList[type];
  return colorCode;
}


function templatePokeCard(Poklist, img, typ, color) {
  return `
  <div  class="col">
    <div class="pCard" style="background-color: ${color};" onclick="pokeInfoDeatail(${Poklist.id})">
      <div class="pCard_body"></div>
      <p class="pCard_name">${Poklist.name}</p>
      <img id="pCard_img" class="pCard_img" src="${img}">
        <span class="pCard_Id">${Poklist.id}</span>
        <div  class="pCard_buttons">
        <span id="test" class="pCard_btn">${typ[0]}</span>
        <span style="display:${typ[1]}" id="test1" class="pCard_btn">${typ[1]}</span>
        </div>
       </div>
  </div>
`
}

function pokeInfoDeatail(id) {
  console.log("Card mit Nummer ", id);
  noneOrflexDisplay([{ "lockoutDisplay": "flex" }, { "detailCard": "flex" }])
  document.getElementById('body').style.overflow = 'hidden';
}


function closeDetailCard() {
  noneOrflexDisplay([{ "lockoutDisplay": "none" }, { "detailCard": "none" }])
  document.getElementById('body').style.overflow = 'auto';
}


function loader(aktiv) {
  let element = document.getElementById('loader');
  if (aktiv) {
    element.style.display = "flex";
    console.log("Loader aktiv");
  } else {
    element.style.display = "none";
    console.log("Loader deaktivirt");
  }
}

function eventListener() {
  document.getElementById('searchField').addEventListener("input", function (event) {
    if (event.target.value === "") {
      document.getElementById('poketCard').innerHTML = "";
      let poketIDs = [];
      for (let i = 1; i <= pokeIndexAkt; i++) {
        poketIDs.push(i);
      }
      loadPokeSelect(poketIDs);
      document.getElementById('btnnext').style.display = 'flex';

    }
  });
}


function noneOrflexDisplay(element = []) {
  element.map(u => {
    const [objekt, value] = Object.entries(u)[0];
    document.getElementById(objekt).style.display = value;
  })
}
