
const DataBaseAPIfirst = "https://pokeapi.co/api/v2/pokemon?limit=100&offset=0";

let DataBaseAPInext = "";

function init() {
  dataPokemonReadAPI();


}



async function dataPokemonReadAPI() {
  //loader(true);
  try {
    let response = await fetch(DataBaseAPIfirst);
    if (!response.status == "200") {
      console.log("Daten fehlgescxjlage");
    }
    let data = (await response.json());
    DataBaseAPInext = data.next;
    let pokeData = data.results;
    let leng = pokeData.length;
    console.log(leng);
    console.log(pokeData);


  } catch (error) {
    console.log("Fehler beim Laden ", error);

  } finally {

    console.log("Daten holen abgeschlossen");

  }




}
function loader(aktiv) {
  let element = document.getElementById('loader');
  if (aktiv) {
    element.style.display = "flex";
    console.log("Loader aktiv");

  } else {
    element.style.display = "none";
  }





}
