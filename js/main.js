let textField = document.getElementById("text-field");
let guessBtn = document.getElementById("guess-btn");
let errorMessage = document.getElementById("error-message");
const resultBox = document.querySelector(".result-box");

guessBtn.addEventListener("click", async function () {
    let textFieldValue = textField.value;
  if (textFieldValue === "") {
    errorMessage.textContent = "You need to write your name";
    return;
  } else {
    errorMessage.textContent = "";
  }

  async function getCountryInfo(countryCode) {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
      const data = await response.json();
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        const currentData = data[i];
        const countryName = currentData.name.common;
        const flagUrl = currentData.flags.png;
        const capital = currentData.capital[0];
        const continent = currentData.continents[0];
        const currencyCodes = Object.keys(currentData.currencies);
        const firstCurrencyCode = currencyCodes[0];
        const currencyData = currentData.currencies[firstCurrencyCode];
        let currency;
        if (typeof currencyData === 'object') {
          currency = currencyData.name;
        } else {
          currency = currencyData;
        }
        
        const languageCodes = Object.keys(currentData.languages);
        const firstLanguageCode = languageCodes[0];
        const languageData = currentData.languages[firstLanguageCode];
        const language = typeof languageData === 'object' ? languageData.name : languageData;
        
        return { countryName, flagUrl, capital, continent, currency, language };
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function fetchData() {
    const agifyResponse = await fetch("https://api.agify.io?name=" + textField.value);
    const agifyData = await agifyResponse.json();
    console.log(agifyData)

    const nationalizeResponse = await fetch("https://api.nationalize.io?name=" + textField.value);
    const nationalizeData = await nationalizeResponse.json();

    const genderizeResponse = await fetch("https://api.genderize.io?name=" + textField.value);
    const genderizeData = await genderizeResponse.json();

    if (nationalizeData.country && nationalizeData.country.length > 0) {
      resultBox.style.backgroundColor = "white";
      let countryInfo = { countryName: "Data not available", capital: "Data not available", currency: "Data not available", continent: "Data not available", language: "Data not available", flagUrl: null };
      countryInfo = await getCountryInfo(nationalizeData.country[0].country_id);
      nationalityProbabilityPercent = Math.round(nationalizeData.country[0].probability * 100) + "%";
      const additionalText = document.getElementById("additional-text")
      additionalText.innerText = `Would you like some more facts about ${countryInfo.countryName}?` 
      const button1HTML = `<button id="more-facts">More facts</button>`;
      const button2HTML = `<button id="home2"><a href="" style="text-decoration: none;">No thanks</a></button>`;
      const restBtn = document.getElementById("rest-btn")
      const resten = document.getElementById("resten");
      
      restBtn.innerHTML = button1HTML + button2HTML;
      
      let listaHTML = `<li>It is <b>${nationalityProbabilityPercent}</b> chance that you are <b>${agifyData.age || "Unknown"} years</b> old and born in <b>${countryInfo.countryName}</b></li>`;
      listaHTML += `<li>There is <b>${agifyData.count || "Unknown"}</b> persons with this name that are born same year in <b>${countryInfo.countryName}</b> </li>`;
      listaHTML += `<li>I am ${Math.round(genderizeData.probability * 100) || "Unknown"}% sure that you are <b>${genderizeData.gender || "Unknown"}</b>, </li>`;

      document.getElementById("lista").innerHTML = listaHTML;

      const button1 = document.getElementById("more-facts");
      button1.addEventListener("click", function () {
        const second = document.getElementById("second");
        second.innerHTML = "";
        const secondHome = `<button id="second-home"><a href="" style="text-decoration: none;">Restart</a></button>`;
        
        document.getElementById("second").innerHTML = secondHome;
        resten.style.backgroundColor = "white";
        let listaHTML2 = `<h4 style="text-align: center;">Facts about ${countryInfo.countryName}:</h4><li>The capital is ${countryInfo.capital} </li>`;
        listaHTML2 += `<li>The language is ${countryInfo.language || "Unknown"} </li>`;
        listaHTML2 += `<li>The flag looks like this <img src="${countryInfo.flagUrl}" alt="Flag" class="flag-image"> </li>`;
        listaHTML2 += `<li>The currency is: ${countryInfo.currency || "Unknown"} </li>`;
        listaHTML2 += `<li>The continent is ${countryInfo.continent || "Unknown"}, </li>`;
        

        document.getElementById("resten").innerHTML = listaHTML2;
        
    });
    } else {
      document.getElementById("lista").innerHTML = "<li>No information found for the given name.</li>";
    }
  }

  fetchData();
});
