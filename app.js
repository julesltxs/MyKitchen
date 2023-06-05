// Use the dotenv package to load environment variables
require('dotenv').config();

const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args)); // Use node-fetch package
const { Client } = require('@notionhq/client'); // Notion client

// Function to extract fdc_id from URL
function extractFdcId(url) {
  const regex = /\d+/; // This regular expression matches one or more digits
  const match = url.match(regex);
  return match ? match[0] : null; // Return the first match, or null if there were no matches
}

// Define the async function
async function syncFunction() {
  const ItemsDBID = 'c1a43f14b5034f058b53d4fc7e789600';

  const response = await fetch(`https://api.notion.com/v1/databases/${ItemsDBID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2021-05-13',
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
            "property": "Calories - G",
            "number": {
              "is_empty": "true"
            }
          }
        ]
      }
    })
  });

  const data = await response.json();

  let fdcIds = [];
  for (let page of data.results) {
    let url = page.properties.URL.url;
    let fdcId = extractFdcId(url);
    fdcIds.push(fdcId);
  }

  console.log(fdcIds.join(','));
}

// Call the function
syncFunction();
