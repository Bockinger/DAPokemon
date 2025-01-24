let basisUrl = "https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0";
let pokeFirstURL = "https://pokeapi.co/api/v2/pokemon/"
let pokeArrayAll = [];
let pokeArraysingle = [];
let SeachArray = [];
let pokeArraySearch = [];
let pokemonsLoad = 24;
let pokeLoadMax = 0;
let pokeIndexAkt = 0;
let pokeNumberCards = 0;
let pokeSelection = [];
let pokeSearchMode = false;
let colorCardList =
{
  grass: "#78C850",
  fire: "#F08030",
  water: "#6890F0",
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
}


function searchPokemon() {
  let pokeSearch = "";
  let resultPokeSearch = [];
  let id = 0;
  let searchString = document.getElementById('searchField').value.trim();
  if (searchString.length <= 2) {
    return;
  }
  document.getElementById('btnnext').style.display = 'none';
  pokeSearch = pokeArrayAll.results.filter(p => p.name.toLowerCase().startsWith(searchString.toLowerCase()));
  pokeSearch.map(p => {
    id = p.url.split("/").filter(part => part).pop();
    resultPokeSearch.push(id);
  });
  document.getElementById('poketCard').innerHTML = "";


  loadPokeSelect(resultPokeSearch, true);
}


function pokeNextSelection() {
  document.getElementById('btnnext').style.display = 'none';
  pokeSelection = [];
  let pokeIndexOld = pokeIndexAkt;
  pokeLoadMax = pokeLoadMax + pokemonsLoad;
  pokeIndexAkt = pokeIndexAkt + pokemonsLoad;
  for (i = pokeIndexOld; i < pokeLoadMax; i++) {
    pokeSelection.push(i + 1);
  }
  document.getElementById('poketCard').innerHTML = "";
  loadPokeSelect(pokeSelection, false);

}


async function loadPokeSelect(pokeSelec, search) {
  try {
    loader(true);
    let pokets = pokeSelec.map(id => `${pokeFirstURL}${id}`);
    let fetchPromis = pokets.map(singleURL => fetch(singleURL).then(Poketresponse => {
      return Poketresponse.json();
    }));
    let ArrayRead = await Promise.all(fetchPromis)
    renderPokeCard(poketSearchStatus(ArrayRead, search), search);
  }
  catch {
    console.log("Fehler beim abrufen der Daten !!!");
  }
}


function poketSearchStatus(ArrayRead, search) {
  if (search) {
    pokeSearchMode = true;
    SeachArray = ArrayRead;
    return ArrayRead;
  } else {
    pokeSearchMode = false;
    let oldArray = pokeArraysingle
    pokeArraysingle = oldArray.concat(ArrayRead);
    return pokeArraysingle;
  }
}


function renderPokeCard(poketList, search) {
  pokeNumberCards = 0;
  let i = 0;
  let element = document.getElementById('poketCard');
  if (pokeSearchMode) {
    element.innerHTML = "";
    document.getElementById('btnReturn').classList.remove('d-none');
    document.getElementById('btnReturn').style.display = "flex";
  }
  poketList.map(pokemon => {
    let img = poketList[i].sprites.other.home.front_default;
    let pokType = typeCheck(pokemon);
    let colorCard = colorCardCheck(pokType[0]);
    element.innerHTML += templatePokeCard(pokemon, img, pokType, colorCard, i);
    i++;
    pokeNumberCards++;
  })
  document.getElementById('btnnext').classList.remove('d-none');
  loader(false);
  scrollToCard(i, search);
}


function scrollToCard(i, search) {
  if (!search) {
    let card = document.getElementById(i - 23);
    const cardPosition = card.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: cardPosition - 60
    });
  }
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
  if (pokeSearchMode) {
    document.getElementById('btnnext').style.display = 'none';
    id = index + 1;
  } else {
    document.getElementById('btnnext').style.display = 'flex';
    id = Poklist.id;
  }
  return `
 <div id="${id}" class="col text-center">
    <div id="pCard" class="pCard" style="background-color: ${color};" onclick="pokeInfoDetail(${id})">
      <div class="pCard_body"></div>
      <p class="pCard_name">${Poklist.name}</p>
      <img id="pCard_img" class="pCard_img" src="${img}">
        <span class="pCard_Id">${Poklist.id}</span>
        <div class="pCard_buttons">
          <span id="test" class="pCard_btn">${typ[0]}</span>
          <span style="display:${typ[1]}" id="test1" class="pCard_btn">${typ[1]}</span>
        </div>
    </div>
    </div>
 `
}


function pokeInfoDetail(id) {
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
  } else {
    element.style.display = "none";
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
  tabAbout();
}


function templatePokemonDetailCard(id) {
  id = id - 1
  let pokeArray = [];
  if (pokeSearchMode) {
    pokeArray = SeachArray;
  } else {
    pokeArray = pokeArraysingle;
  }
  let colorCard = ColorDetailCard(pokeArray, id);
  return `
  <div style="background-color: ${colorCard}; border-radius:8px;">
  <div class="detail_Card_Header" >
        <spam>${pokeArray[id].name}</spam>
        <img class="img_Pokemon" src="${pokeArray[id].sprites.other.home.front_default}">
        <img onclick="closeDetailCard()" class="close_Button" src="./assets/close.svg">
      </div>
      <hr>
      <div class="detail_Card_Menu">
        <a href="#!" id="btnAbout" class="btn_About btn_About_aktiv" onclick="tabAbout()">About</a>
        <a href="#!" id="btnBase"  class="btn_Base btn_Base_aktiv"  onclick="tabBaseStats()">Base Stats</a>
        <p class="poke_Detail_ID">${pokeArray[id].id}</p>
      </div>
      <div class="detail_Card_Infos">

      <div class="">
           <div id="about" class="Card_Detail_About">
            <table class="Tab_about">
              <tbody>
                <tr>
                  <td class="td1">Height</td>
                  <td>${(pokeArray[id].height) * 10} cm</td>
                </tr>
                <tr>
                  <td class="td1">Weight</td>
                  <td>${(pokeArray[id].weight) / 10} kg</td>
                </tr>
                 <tr>
                  <td class="td1">Experience</td>
                  <td>${pokeArray[id].base_experience}</td>
                </tr>
                 </tr>
                 <tr>
                  <td class="td1">Abilities</td>
                  <td>${abilitiesRead(id, pokeArray)}</td>
                </tr>
              </tbody>
            </table>
           </div>


          <div id="baseStats" class="Card_Detail_BaseStats">
            <table class="tab_basestate">
              <tbody>
                <tr>
                  <td class="td1">hp</td>
                  <td>${pokeArray[id].stats[0].base_stat}</td>
                   <td>
                        <div class=progress>
                         <div style="background-color:${ColorProgressbar(id, pokeArray[id].stats[0].base_stat)}; width:${pokeArray[id].stats[0].base_stat}px;" ></div>
                        </div>
                   </td>
                </tr>
                <tr>
                  <td class="td1">attack</td>
                  <td>${pokeArray[id].stats[1].base_stat}</td>
                        <td class"td3b>
                        <div  class=progress>
                        <div style="background-color:${ColorProgressbar(id, pokeArray[id].stats[1].base_stat)}; width:${pokeArray[id].stats[1].base_stat}px;" ></div>
                        </div>
                   </td>
                </tr>
                 <tr>
                  <td  class="td1">defense</td>
                  <td>${pokeArray[id].stats[2].base_stat}</td>
                  <td>
                        <div  class=progress>
                        <div style="background-color:${ColorProgressbar(id, pokeArray[id].stats[2].base_stat)}; width:${pokeArray[id].stats[2].base_stat}px;" ></div>
                        </div>
                   </td>
                </tr>

                 <tr>
                  <td  class="td1">special-attack</td>
                  <td>${pokeArray[id].stats[3].base_stat}</td>
                  <td>
                        <div  class=progress>
                        <div style="background-color:${ColorProgressbar(id, pokeArray[id].stats[3].base_stat)}; width:${pokeArray[id].stats[3].base_stat}px;" ></div>
                        </div>
                   </td>
                </tr>

                 <tr>
                  <td  class="td1">special-defense</td>
                  <td>${pokeArray[id].stats[4].base_stat}</td>
                    <td>
                        <div  class=progress>
                        <div style="background-color:${ColorProgressbar(id, pokeArray[id].stats[4].base_stat)}; width:${pokeArray[id].stats[4].base_stat}px;" ></div>
                        </div>
                   </td>
                </tr>
                 <tr>
                  <td  class="td1">speed</td>
                  <td>${pokeArray[id].stats[5].base_stat}</td>
                  <td>
                        <div  class=progress>
                        <div style="background-color:${ColorProgressbar(id, pokeArray[id].stats[5].base_stat)}; width:${pokeArray[id].stats[5].base_stat}px;" ></div>
                        </div>
                   </td>
                </tr>
              </tbody>
             </table>
          </div>     </div>
              <hr>
                </div>
      <br>
      <div class="detail_Card_footer">
        <img id="btnback" class="btn_DeCard" src="./assets/back.svg" onclick="pokeCardDeback(${id})">
        <img id="btnforward" class="btn_DeCard" src="./assets/forward.svg" onclick="pokeCardDeforward(${id})">
      </div>
</div>
      `
}

function ColorProgressbar(id, number) {
  console.log("Number ", number);
  return color = number >= 51 ? "green" : "red";
}


function ColorDetailCard(pokeArray, id) {
  let element = pokeArray[id].types[0].type.name;
  return colorCardList[element];
}


function pokeCardDeback(id) {
  if (id > 0) {
    renderPokemonDetailCard(id);
  } else {
    id = pokeNumberCards;
    renderPokemonDetailCard(id);
  }
}


function pokeCardDeforward(id) {
  if ((id + 1) == pokeNumberCards) {
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
      searchExit();
    }
  });
}


function searchExit() {
  document.getElementById('poketCard').innerHTML = "";
  let poketIDs = [];
  for (let i = 1; i <= pokeIndexAkt; i++) {
    poketIDs.push(i);
  }
  document.getElementById('searchField').value = "";
  pokeSearchMode = false;
  renderPokeCard(pokeArraysingle);
  document.getElementById('btnnext').style.display = 'flex';
  document.getElementById('btnReturn').style.display = 'none';
}



function abilitiesRead(id, pokArrayAktiv) {
  let PoketAabilities = "";
  let returnString = "";
  for (i = 0; i < pokArrayAktiv[id].abilities.length; i++) {
    PoketAabilities = pokArrayAktiv[id].abilities[i].ability.name.charAt(0).toUpperCase() + pokArrayAktiv[id].abilities[i].ability.name.slice(1);
    returnString = returnString + PoketAabilities + "<br>";
  }
  return returnString;
}


function tabAbout() {
  document.getElementById('btnAbout').classList.add("btn_About_aktiv", "Card_Detail_About");
  document.getElementById('btnBase').classList.remove("btn_Base_aktiv");
  document.getElementById('about').style.display = "flex";
  document.getElementById('baseStats').style.display = 'none';
}

function tabBaseStats() {
  document.getElementById('btnBase').classList.add("btn_Base_aktiv");
  document.getElementById('btnAbout').classList.remove("btn_About_aktiv");
  document.getElementById('baseStats').style.display = 'flex';
  document.getElementById('about').style.display = "none";
}
