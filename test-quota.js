import { GEMINI_API_KEY } from "./src/config/config.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    await model.generateContent("Hello");
    console.log(`SUCCESS: ${modelName} has quota available!`);
    return true;
  } catch (e) {
    console.log(`FAIL: ${modelName} - ${e.message.split('\n')[0]}`);
    return false;
  }
}

async function runTests() {
  await testModel("gemini-2.0-flash");
  await testModel("gemini-2.0-flash-lite");
  await testModel("gemini-2.5-flash");
  await testModel("gemini-pro-latest");
}

runTests();
