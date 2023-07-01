// Loads .env file
require('dotenv').config();

//Imports Fetch & Notion Packages
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args)); // Use node-fetch package
const { Client } = require('@notionhq/client'); // Notion client

async function getDatabaseProperties(databaseId) {
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
  });

  const data = await response.json();
  return data;
}

let propertyIdMapping = {};
async function fetchDatabasePropertyIDs() {
  const ItemsDBID = 'c1a43f14b5034f058b53d4fc7e789600';

  const databaseProperties = await getDatabaseProperties(ItemsDBID);
  for (let property in databaseProperties.properties) {
    propertyIdMapping[property] = databaseProperties.properties[property].id;
  }
}

fetchDatabasePropertyIDs();


// Define your Nutrient Mapping
let nutrientMapping = {
  "Protein - G": { ids: [1003], method: 'first' },
  "Carbs - G": { ids: [1005,2039,1050,1072], method: 'first' },
  "Fats - G": { ids: [1085,1004], method: 'first' },
  "Calories": { ids: [2048,2047,1008], method: 'first' },
  "Vitamin A - IU": { ids: [1104], method: 'first' },
  "Vitamin B1 - MG": { ids: [1165], method: 'first' },
  "Vitamin B2 - MG": { ids: [1166], method: 'first' },
  "Vitamin B3 - MG": { ids: [1167,1169], method: 'first' },
  "Vitamin B5 - MG": { ids: [1170], method: 'first' },
  "Vitamin B6 - MG": { ids: [1175,1174], method: 'first' },
  "Vitamin B7 - MG": { ids: [1176], method: 'first' },
  "Vitamin B8 - MG": { ids: [1181], method: 'first' },
  "Vitamin B9 - MCG": { ids: [1177,1187], method: 'first' },
  "Vitamin B12 - UG": { ids: [1178], method: 'first' },
  "Vitamin C - MG": { ids: [1162], method: 'first' },
  "Vitamin D - MG": { ids: [2059,1114], method: 'sum' },
  "Vitamin E - MG": { ids: [1109], method: 'first' },
  "Vitamin K - UG": { ids: [1183,1184,1185], method: 'sum' },
  "Sodium - MG": { ids: [1093], method: 'first' },
  "Potassium - MG": { ids: [1092], method: 'first' },
  "Cholesterol - MG": { ids: [1253], method: 'first' },
  "Copper - MCG": { ids: [1098], method: 'first' },
  "Magnesium - MG": { ids: [1090], method: 'first' },
  "Manganese - MG": { ids: [1101], method: 'first' },
  "Phosphorus - MG": { ids: [1091], method: 'first' },
  "Selenium - MG": { ids: [1103], method: 'first' },
  "Zinc - MG": { ids: [1095], method: 'first' },
  "Calcium - MG": { ids: [1087], method: 'first' },
  "Fiber - G": { ids: [1079,2033], method: 'first' },
  "Iron - MG": { ids: [1089], method: 'first' },
  "Monounsaturated Fatty Acids - G": { ids: [1292,1327,1319], method: 'first' },
  "Polyunsaturated Fatty Acids - G": { ids: [1293,1328,1320], method: 'first' },
  "Trans Fatty Acids - G": { ids: [1257], method: 'first' },
  "Saturated Fatty Acids - G" : { ids: [1258,1326,1318], method: 'first' },
  "Bad Carbs - G": { ids: [1014,1011,1012,1075,1010,1013], method: 'sum' },
  "Good Carbs - G": { ids: [1009,1082,1084,1065,1022,1021,1017,1403,1071,1015,1016,1019,1069], method: 'sum' },
  "Water - G" : { ids: [1051], method: 'first' },
  "Caffeine - MG" : { ids: [1057], method: 'first' },
  "Choline - MG" : { ids: [1180], method: 'first' },
  "Retinol - UG" : { ids: [1105], method: 'first' },
  "Alcohol - G" : { ids: [1018], method: 'first' },
  "Chromium - UG" : { ids: [1096], method: 'first' },
  "Salt - MG" : { ids: [1149], method: 'first' },
  "Vanadium - UG" : { ids: [1155], method: 'first' },
  "Lutein - UG" : { ids: [1121], method: 'first' },
  "Zeaxanthin - UG" : { ids: [1119], method: 'first' },
  "Antioxidants - MG" : { ids: [2041,1201,1202,1203,1204,1207,1208,1368,1369,1365,1370,1372,1373,1380,1378,1205,1206,1209,1374,1376,1377,1379], method: 'sum' },
  "Anti Inflammatories - MG" : { ids: [1205,1206,1209,1374,1376,1377,1379], method: 'sum' },
  "Tryptophan - G" : {ids: [1210]},
  "Threonine - G" : {ids: [1211]},
  "Isoleucine - G" : {ids: [1212]},
  "Leucine - G" : {ids: [1213]},
  "Lysine - G" : {ids: [1214]},
  "Methionine - G" : {ids: [1215]},
  "Cystine - G" : {ids: [1216]},
  "Phenylalanine - G" : {ids: [1217]},
  "Valine - G" : {ids: [1219]},
  "Histidine - G" : {ids: [1221]},
  "Omega-3": {
    subAcids: {
      "Alpha-Linolenic Acid": [1404, 1270, 1409, 2018],
      "Docosahexaenoic Acid": [1272, 2025],
      "Docosapentaenoic Acid": [1280, 2024],
      "Eicosapentaenoic Acid": [1278, 2023],
      "Eicosatetraenoic Acid": [1407],
      "Eicosatrienoic Acid": [1405]
    },
    method: 'sumSubAcids'
  },
  "Omega-6": {
    subAcids: {
      "Linoleic Acid": [1269, 1307, 1308, 1309, 1311, 1316, 2016],
      "Gamma-Linolenic Acid": [1321],
      "Arachidonic Acid": [1271, 1406, 1408, 2022],
      "Eicosadienoic Acid": [1313, 2026]
    },
    method: 'sumSubAcids'
  },
  "Omega-7": {
    subAcids: {
      "Palmitoleic Acid": [1324]
    },
    method: 'sumSubAcids'
  },
  "Omega-9": {
    subAcids: {
      "Mead Acid": [1414]
    },
    method: 'sumSubAcids'
  },
}

// Mapping of measure_unit_id to MetricUnitDBs Page IDs
let unitIdMapping = {
  'g': '95e62303e7f5466aadeba5d026c622fb',
  'grams': '95e62303e7f5466aadeba5d026c622fb',
  'gram': '95e62303e7f5466aadeba5d026c622fb',
  'kg': '6d5ac4539eee497eabd2c365eb698a1e',
  'oz': '25d210a91e6c461f86ee4cc811165023',
  'lb': '042a114789bb4cfcbe60c63f30443b81',
  'ml': 'ea14fb6a025d4ec9a19feabe79a001eb',
  'mililiter': 'ea14fb6a025d4ec9a19feabe79a001eb',
  'l': '6c7f39e64e0b46eaae65cffa2dd1e511',
  'tsp': '1394e292a74b4bc2a42e3bba26437721',
  'tbsp': '4f20c431717040df9c283984312e86bf',
  'tablespoon': '4f20c431717040df9c283984312e86bf',
  'fl oz': '3688d2649bf940b28b4eade01783a74c',
  'cup': '6e218dec224048a585c7bd16deeccc9f',
  'pc': 'b4723cf60e4f4f149a132b9a6e84a6f2',
  'whole': '10bff8bd48c84a5eadd7dbc30a642d0a',
};

// Function to extract fdc_id from URL
function extractFdcId(url) {
  const regex = /\d+/; // This regular expression matches one or more digits
  const match = url.match(regex);
  return match ? parseInt(match[0]) : null; // Return the first match, or null if there were no matches
}

//Function that fetches Food Details from Food ID using USDA API
async function fetchFoodDetails(fdcIds, pages, propertyIdMapping) {
  const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods?api_key=${process.env.USDA_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fdcIds: fdcIds })
  });

  let amountPropName = 'Amount';
  let unitPropName = 'Unit';
  
  const foodDetails = await response.json();
  
  const processedFdcIds = new Set(); // We will store processed fdcIds here
  let pagesData = []; // Here we declare the array to store our data

  // Extract and display desired properties
  foodDetails.forEach(async food => {
    // If we have already processed this fdcId, skip it
    if (processedFdcIds.has(food.fdcId)) {
      return;
    }
    // If it's a new fdcId, add it to the processedFdcIds set
    processedFdcIds.add(food.fdcId);

    let fdcId = food.fdcId; // Define fdcId here
    // Find the corresponding page for this food item
    let page = pages.find(p => extractFdcId(p.properties.URL.url) === food.fdcId);
    let notionId = page.id; // This is the 'ID' of the page in Notion
    let notionPageId = page.id; // Get the notion page ID
    let unit;
    let mappedUnitId = unitIdMapping[unit];
    let mappedNutrients = {};
    let amount;

    switch (food.dataType) {
      case 'Branded':
        category = food.brandedFoodCategory || 'Unknown';
     // Set amount and unit
     if (food.servingSizeUnit && (food.servingSizeUnit.toLowerCase() === 'ml' || food.servingSizeUnit.toLowerCase() === 'mililiter')) {
      amount = 100; // You can set this to any default value for 'ml'
      unit = 'ml';
  } else {
      amount = 100; // Default value for grams
      unit = 'g';
  }
        unit = food.servingSizeUnit || 'Unknown';
        let brandOwner = food.brandOwner || 'Unknown';
        let ingredients = food.ingredients || 'Unknown';
        console.log('\n'); // Extra line
        console.log(`fdcId: ${food.fdcId}, description: '${food.description}', dataType: '${food.dataType}', category: '${category}', amount: ${amount}, unit: '${unit}'`);
        console.log(`Notion Page ID: ${notionId}`); // Display Notion Page ID
        mappedUnitId = unitIdMapping[unit];
        console.log(`Notion Unit Page ID: '${mappedUnitId}`);
        console.log('\n'); // Extra line
        console.log(`Brand: '${brandOwner}'`);
        console.log(`Ingredients: '${ingredients}'`);

        break;

      case 'Foundation':
        category = food.foodCategory ? food.foodCategory.description : 'Unknown';
        // Directly assign 100 to amount and 'g' to unit for 'Foundation' food items
        amount = 100;
        unit = 'g'
        console.log('\n'); // Extra line
        console.log(`fdcId: ${food.fdcId}, description: '${food.description}', dataType: '${food.dataType}', category: '${category}', amount: ${amount}, unit: '${unit}'`);
        console.log(`Notion Page ID: ${notionId}`); // Display Notion Page ID
        mappedUnitId = unitIdMapping[unit];
        console.log(`Notion Unit Page ID: '${mappedUnitId}`);
    
        break;

      case 'Survey (FNDDS)':
        category = (food.wweiaFoodCategory && food.wweiaFoodCategory.description) || 'Unknown';
        amount = 100;

        if (food.foodPortions && food.foodPortions[0] && food.foodPortions[0].portionDescription) {
            let amountMatch = food.foodPortions[0].portionDescription.match(/\d+/);
            
            if (amountMatch && amountMatch.length > 0) {
                amount = parseFloat(amountMatch[0]);
            }
        };
        unit = 'g'
        console.log('\n'); // Extra line
        console.log(`fdcId: ${food.fdcId}, description: '${food.description}', dataType: '${food.dataType}', category: '${category}', amount: ${amount}, unit: '${unit}'`);
        console.log(`Notion Page ID: ${notionId}`); // Display Notion Page ID
        mappedUnitId = unitIdMapping[unit];
        console.log(`Notion Unit Page ID: '${mappedUnitId}`);

      
        break;
      
      default:
        category = 'Unknown';
        amount = 'Unknown';
        unit = 'Unknown';
        console.log('\n'); // Extra line
        console.log(`fdcId: ${food.fdcId}, description: '${food.description}', dataType: '${food.dataType}', category: '${category}', amount: ${amount}, unit: '${unit}'`);
        console.log(`Notion Page ID: ${notionId}`); // Display Notion Page ID
        mappedUnitId = unitIdMapping[unit];
        console.log(`Notion Unit Page ID: '${mappedUnitId}`);

    
    }
    
    console.log('\n'); // Extra line

// Nutrient Mapping calculation
for (let nutrientName in nutrientMapping) {
  let nutrientInfo = nutrientMapping[nutrientName];
  if (nutrientInfo.method !== 'sumSubAcids') {
    let nutrients = food.foodNutrients.filter(nutrient => 
      nutrientInfo.ids.includes(nutrient.nutrient.id) && !isNaN(nutrient.amount)
    );
    if (nutrients.length > 0) {
      let nutrientAmount;
      switch (nutrientInfo.method) {
        case 'first':
          nutrientAmount = nutrients[0].amount;
          break;
        case 'sum':
          nutrientAmount = nutrients.reduce((sum, nutrient) => sum + nutrient.amount, 0);
          break;
      }
      mappedNutrients[nutrientName] = {
        propertyId: propertyIdMapping[nutrientName],
        amount: parseFloat(nutrientAmount.toFixed(2))
      };
    }
  } else {
    let subAcidAmounts = [];
    for (let subAcidName in nutrientInfo.subAcids) {
      let subAcidIds = nutrientInfo.subAcids[subAcidName];
      let nutrients = food.foodNutrients.filter(nutrient => 
        subAcidIds.includes(nutrient.nutrient.id) && !isNaN(nutrient.amount)
      );
      if (nutrients.length > 0) {
        subAcidAmounts.push(nutrients[0].amount);
      }
    }
    if (subAcidAmounts.length > 0) {
      let nutrientAmount = subAcidAmounts.reduce((sum, amount) => sum + amount, 0);
      mappedNutrients[nutrientName] = {
        propertyId: propertyIdMapping[nutrientName],
        amount: nutrientAmount
      };
    }
  }
}

    console.log(mappedNutrients);
    pagesData.push({
      notionId: notionId,
      mappedUnitId: mappedUnitId,
      mappedNutrients: mappedNutrients,
      amount: amount,
      ingredients: food.ingredients, 
      description: food.description,   
      dataType: food.dataType  ,
      brandOwner: food.dataType === 'Branded' ? (food.brandOwner || 'Unknown').replace(',', '') : null,
    });
  });
  
  // After all data has been pushed into pagesData, loop through each item and update the Notion database
  for (let pageData of pagesData) {
    await updateNotionDatabase(pageData, null, null, null, null, propertyIdMapping);  // Passing whole pageData object here
  }

  // Return pagesData array at the end of your fetchFoodDetails function
  return pagesData;
}

// Define the async function
async function syncFunction() {
  const ItemsDBID = 'c1a43f14b5034f058b53d4fc7e789600';

  const response = await fetch(`https://api.notion.com/v1/databases/${ItemsDBID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "filter": {
        "and": [
          {
            "property": "URL",
            "url": {
              "contains": "fdc.nal.usda.gov"
            }
          },
          {
            "property": "Calories",
            "number": {
              "is_empty": true
            }
          }
        ]
      }
    })
  });
  
  const data = await response.json();
  
  let fdcIds = [];
  let pages = [];
  for (let page of data.results) {
    let url = page.properties.URL.url;
    let fdcId = extractFdcId(url);
    fdcIds.push(fdcId);

      // Store property IDs in addition to the page ID
      for (let propertyName in page.properties) {
        if (!propertyIdMapping[propertyName]) {
          propertyIdMapping[propertyName] = page.properties[propertyName].id;
        }
      }
    
          // Add property ID mapping to page object
    page.propertyIdMapping = propertyIdMapping;
    
    pages.push(page); // Store the page
  }

  console.log(`Fetching details for ${fdcIds.length} items`);
  await fetchFoodDetails(fdcIds, pages, propertyIdMapping); // Pass the pages to fetchFoodDetails
}

async function updateNotionDatabase(pageData, propertyIdMapping) {
  // Initialize nutrientProperties as an empty object
  let nutrientProperties = {};

  // Build nutrient properties
  for (let nutrientName in pageData.mappedNutrients) {
    const nutrient = pageData.mappedNutrients[nutrientName];
    const propertyId = nutrient.propertyId;  // get the property_id from the nutrient object
    
    if (propertyId) {  // check if the property_id exists
      nutrientProperties[propertyId] = {
        number: nutrient.amount
      };
    }
  }
  

  // Call to Notion API to update page properties
  const fetch = require('node-fetch');
  
  const response = await fetch(`https://api.notion.com/v1/pages/${pageData.notionId}`, { // Using pageData.notionId here
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      properties: {
       ...nutrientProperties,
        'Unit': {
          type: "relation",
          relation:[{
            database_id: "f8161afaa7bc445a9edd3841ba82b870",
            id: pageData.mappedUnitId,
          }]
        },
        'Amount': {
          type: "number",
          number: pageData.amount
        },
        'Brand': {  
          type: "select",
          select: {
            name: pageData.brandOwner || 'N/A',
          }
        },
          'USDA Name': {
            type: "rich_text",
            rich_text: [
              {
                type: "text",
                text: {
                  content: pageData.description
                }
              }
            ]
          },
          'Data Type': {
            type: "select",
            select: {
              name: pageData.dataType
            }
          },
            'Ingredients': {
              type: "rich_text",
              rich_text: [
              {
                  type: "text",
                  text: {
                    content: pageData.ingredients || 'N/A'
                  }
                }
              ]
          }
        }
      })
    });

    const responseBody = await response.json();
    if (response.status !== 200) {
      console.error('Error updating Notion page:', responseBody);
    } else {
      console.log('Page updated successfully:', responseBody);
    }
  }
  
  

// Call the function
syncFunction();
