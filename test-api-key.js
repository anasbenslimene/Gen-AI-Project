import { GEMINI_API_KEY } from "./src/config/config.js";

async function testKey() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
    const data = await response.json();
    console.log("Status:", response.status);
    if (response.status === 200) {
      console.log("SUCCESS! The API key is VALID.");
      console.log(`Found ${data.models?.length || 0} models available.`);
    } else {
      console.log("Error! The API key is likely INVALID.");
      console.log(data);
    }
  } catch (e) {
    console.error(e);
  }
}

testKey();
