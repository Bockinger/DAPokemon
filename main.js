let basisUrl = "https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0";
let pokeFirstURL = "https://pokeapi.co/api/v2/pokemon/"


let pokeArrayAll = [];
let pokeArraysingle = [];
let SeachArray = [];
let serachID = [];
let pokeArraySearch = [];

let pokemonsLoad = 24;
let pokeLoadMax = 0;
let pokeIndexAkt = 0;
let pokeSelection = [];
let pokeSearchMode = false;

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
  pokeSearch.map(p => {
    let id = p.url.split("/").filter(part => part).pop();
    resultPokeSearch.push(id);
  });

  serachID = resultPokeSearch;
  console.log("Gefunden Arra", pokeSearch);
  console.log("Result ", resultPokeSearch);
  document.getElementById('poketCard').innerHTML = "";

  loadPokeSelect(resultPokeSearch, true);
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
  document.getElementById('poketCard').innerHTML = "";
  loadPokeSelect(pokeSelection);
  document.getElementById('btnnext').style.display = 'flex';
}


async function loadPokeSelect(pokeSelec, search) {
  loader(true);
  try {

    console.log("PoketSelect ==  ", pokeSelec);

    const pokets = pokeSelec.map(id => `${pokeFirstURL}${id}`);
    let fetchPromis = pokets.map(singleURL => fetch(singleURL).then(Poketresponse => {
      return Poketresponse.json();
    }));
    let ArrayRead = await Promise.all(fetchPromis)
    if (search) {
      pokeSearchMode = true;
      SeachArray = ArrayRead;
      //console.log("Search Ids ", ResultpokeSearch);

      console.log("Such ARRAY ", SeachArray);

      renderPokeCard(ArrayRead); //serach Id
    } else {
      pokeSearchMode = false;
      let oldArray = pokeArraysingle
      pokeArraysingle = oldArray.concat(ArrayRead);
      renderPokeCard(pokeArraysingle);
    }
  } catch {
    console.log("Fehler beim abrufen der Daten !!!");
  }
}


function renderPokeCard(poketList) {
  let i = -1;
  let element = document.getElementById('poketCard');
  poketList.map(pokemon => {
    i++;
    let img = pokeArraysingle[i].sprites.other.home.front_default;
    let pokType = typeCheck(pokemon);
    let colorCard = colorCardCheck(pokType[0]);
    element.innerHTML += templatePokeCard(pokemon, img, pokType, colorCard, i);
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


function templatePokeCard(Poklist, img, typ, color, index) {
  console.log("Index bei Template ", index);

  if (pokeSearchMode) {
    id = index + 1;
  } else {
    id = Poklist.id;
  }
  return `
  <div  class="col">
    <div id="pCard" class="pCard" style="background-color: ${color};" onclick="pokeInfoDetail(${id})">
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

function pokeInfoDetail(id) {
  console.log("Card mit Nummer ", id);
  noneOrflexDisplay([{ "lockoutDisplay": "flex" }, { "detailCard": "flex" }])
  document.getElementById('body').style.overflow = 'hidden';
  renderPokemonDetailCard(id);

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



function noneOrflexDisplay(element = []) {
  element.map(u => {
    const [objekt, value] = Object.entries(u)[0];
    document.getElementById(objekt).style.display = value;
  })
}


function renderPokemonDetailCard(id) {
  let element = document.getElementById('detailCard');
  element.innerHTML = "";
  element.innerHTML = templatePokemonDetailCard(id);
}



function templatePokemonDetailCard(id) {
  console.log("Detail Caed Id ", id);
  id = id - 1
  let pokeArray = [];


  if (pokeSearchMode) {
    pokeArray = SeachArray;
    console.log(SeachArray);


  } else {
    pokeArray = pokeArraysingle
  }



  return `
  <div class="detail_Card_Header">
        <spam>${pokeArray[id].name}</spam>
        <img class="img_Pokemon" src="${pokeArray[id].sprites.other.home.front_default}">
        <img onclick="closeDetailCard()" class="close_Button" src="./assets/close.svg">
      </div>
      <hr>
      <div class="detail_Card_Menu">
        <a href="#">About</a>
        <a href="#">Base Stats</a>
      </div>
      <div class="detail_Card_Infos">
        <div class="Card_Detail_About">
        </div>
        <div class="Card_Detail_BaseStats">
          <div class="progress_Bar">
            <table>
              <tbody>
                <tr>
                  <td>hp</td>
                  <td>${pokeArray[id].stats[0].base_stat}</td>
                </tr>
                <tr>
                  <td>attack</td>
                  <td>${pokeArray[id].stats[1].base_stat}</td>
                </tr>
                 <tr>
                  <td>defense</td>
                  <td>${pokeArray[id].stats[2].base_stat}</td>
                </tr>

                 <tr>
                  <td>special-attack</td>
                  <td>${pokeArray[id].stats[3].base_stat}</td>
                </tr>

                 <tr>
                  <td>special-defense</td>
                  <td>${pokeArray[id].stats[4].base_stat}</td>
                </tr>
                 <tr>
                  <td>speed</td>
                  <td>${pokeArray[id].stats[5].base_stat}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <hr>
      <div class="detail_Card_footer">
        <img id="btnback" class="btn_DeCard" src="./assets/back.svg" onclick="pokeCardDeback(${id})">
        <img id="btnforward" class="btn_DeCard" src="./assets/forward.svg" onclick="pokeCardDeforward(${id})">
      </div>
      `


}


function pokeCardDeback(id) {
  if (id > 0) {
    renderPokemonDetailCard(id);
  } else {
    id = pokeIndexAkt;
    renderPokemonDetailCard(id);
  }
}


function pokeCardDeforward(id) {
  if ((id + 1) == pokeIndexAkt) {
    id = 1;
    renderPokemonDetailCard(id);
  } else {
    renderPokemonDetailCard(id + 2);
  }
}



function searchMode() {
  document.getElementById = 'pCard'.style.pointerEvents = 'none';
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
