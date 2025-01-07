
//https://pokeapi.co/api/v2/pokemon/1/       &offset=0

let basisUrl = "";
let DataBaseAPI = "https://pokeapi.co/api/v2/pokemon?limit=";
let DetailUrl = "https://pokeapi.co/api/v2/pokemon/";
let PokemonAllName = [];
let DataBaseAPInext = "";
let PokId = 0;


function init() {
  document.getElementById('btnnext').style.display = 'flex';
  loader(false);
  PokeAPIAllData();
  dataPokemonReadAPI(DataBaseAPI, false, 4);
}


function PokeAPIAllData() {
  //lade alle Pokemon
  let dataAll = dataPokemonReadAPI(DataBaseAPI, true, 1500);
  console.log("Alle daten ", dataAll);
}

async function dataPokemonReadAPI(pfadAPI, search, pokeLimit) {
  loader(true);
  try {


    let response = await fetch(`${pfadAPI}${pokeLimit}${" & offset=0"}`);
    if (!response.status == "200") {
      console.log("Daten fehlgescxjlage");
    }
    let data = (await response.json());
    console.log("data ", data);

    if (search) {
      console.log("Starte alle");
      loader(false);
      return data;
    }

    DataBaseAPInext = data.next;
    console.log("Next Load = ", DataBaseAPInext);
    let pokeData = data.results;
    let pokleng = pokeData.length;
    console.log("PokeData ", pokeData);
    PokId = PokId + pokeLimit
    console.log("PokId = ", PokId);

    pokemonData(pokeData, PokId, pokeLimit);


  } catch (error) {
    console.log("Fehler beim Laden ", error);
  } finally {
    console.log("Daten holen abgeschlossen");
  }
}


async function pokemonData(data, NewId, pokeLimit) {

  console.log("NEW Id = ", NewId);
  let data1;
  let IdPokemon = NewId - pokeLimit;
  console.log("PockemonId =  ", IdPokemon);



  for (i = 0; i < pokeLimit; i++) {
    data1 = await pokemonReadDetail(IdPokemon + 1);
    console.log("Responde Detail ", data1);
    console.log("Zähler i =", i);
    IdPokemon++
    let typesArr = typeCheck(data1);
    PokemonAllName.push({
      "id": IdPokemon,
      "name": data[i].name,
      "height": data1.height,
      "weight": data1.weight,
      "type1": typesArr[0],
      "type2": typesArr[1],
      "img": data1.sprites.front_default
    })

    console.log("IMG ", PokemonAllName[i].img);


    renderPokeCard(PokemonAllName[i].img);
  }

  console.log("Pocket all Name ", PokemonAllName);

  loader(false);
}



async function pokemonReadDetail(id) {
  let urlDetail = `${DetailUrl}${id}${"/"}`;
  try {
    console.log("Detail URL ", urlDetail)
    let responseDetail = await fetch(urlDetail);
    if (!responseDetail.status == "200") {
      console.log("Daten fehlgescxjlage");
    } else {
      let data = (await responseDetail.json());
      return data;
    }
  } catch (error) {
    console.log("Fehler beim Detail Fetch ", error);
  } finally {
    console.log("Zusatzsdatebn wurden geholt");
  }
}



function typeCheck(data1) {
  let typesLenght = data1.types.filter(item => item.hasOwnProperty('slot')).length;
  let typesArray = [];
  if (typesLenght > 1) {
    return typesArray = [data1.types[0].type.name, data1.types[1].type.name];
  } else {
    return typesArray = [data1.types[0].type.name, "0"];
  }
}





function renderPokeCard(img) {
  let element = document.getElementById('poketCard');

  element.innerHTML += templatePokeCard(img);

}


function templatePokeCard(img) {

  return `
  <div class="col">
    <div class="pCard">
      <div class="pCard_body"></div>
      <p class="pCard_name">Name des Pooke</p>
      <img class="pCard_img" src=${img}>
        <span class="pCard_Id">1</span>
        <div class="pCard_buttons">
          <a class="pCard_btn" href="#">Grass</a>
          <a class="pCard_btn" href="#">Poison</a>
        </div>
    </div>
  </div>
`
}






function loader(aktiv) {
  let element = document.getElementById('loader');
  if (aktiv) {
    element.style.display = "flex";
    console.log("Loader aktiv");
  } else {
    element.style.display = "none";
    console.log("Loader deaktivirt");
    console.log("Array ", PokemonAllName);
  }
}
