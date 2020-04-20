const fs = require("fs").promises;

async function loadRefusals() {
    const refusalsPath =
        "./raw-data/adjusted-refusal-rates-by-nationality-fiscal-year-2019.csv";
    const data = await fs.readFile(refusalsPath, "utf-8");
    let list = data.split("\r\n");
    var newJSON = {};
    list.forEach(element => {
        let decompose = element.split(",");
        let country = decompose[0].toLowerCase();
        let value = decompose[1];
        newJSON[country.toString()] = value;
    });
    return newJSON;
}

async function loadCountriesGeo() {
    const geocountriesPath = "./raw-data/countries.geojson";
    const data = await fs.readFile(geocountriesPath, "utf-8");
    return JSON.parse(data);
}

async function mergeDatasets() {
    let newDatasetPath = "./raw-data/countries-and-refusals.geojson";
    let refusals = await loadRefusals();
    let geocountries = await loadCountriesGeo();
    geocountries["features"].forEach(element => {
        let countryName = element["properties"]["ADMIN"].toLowerCase();
        let resultByCountry = refusals[countryName];
        element["properties"]["refusals"] = resultByCountry;
    });
    // console.log(geocountries["features"][1]);

    fs.writeFile(newDatasetPath, JSON.stringify(geocountries));
    console.log("Created file", newDatasetPath);
}

mergeDatasets();