const fetch = require('node-fetch');
require('dotenv').config();

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

async function fetchDatabasePropertyIDs() {
  const ItemsDBID = 'c1a43f14b5034f058b53d4fc7e789600';

  const databaseProperties = await getDatabaseProperties(ItemsDBID);
  let propertyIdMapping = {};
  for (let property in databaseProperties.properties) {
    propertyIdMapping[property] = databaseProperties.properties[property].id;
  }

  console.log(propertyIdMapping);
}

fetchDatabasePropertyIDs();
