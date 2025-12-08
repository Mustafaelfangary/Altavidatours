const fs = require('fs');
const path = require('path');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

// Configure paths
const localesPath = path.join(process.cwd(), 'public/locales');
const sourceLanguage = 'en';

// Rate limiting
const RATE_LIMIT_DELAY = 2000; // 2 seconds between requests

// Initialize i18next
i18next
  .use(Backend)
  .init({
    lng: sourceLanguage,
    fallbackLng: sourceLanguage,
    ns: ['common', 'nav'],
    defaultNS: 'common',
    backend: {
      loadPath: path.join(localesPath, '{{lng}}/{{ns}}.json'),
      addPath: path.join(localesPath, '{{lng}}/{{ns}}.missing.json')
    }
  });

// Helper function to read JSON files
function readJsonFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return JSON.parse(content);
}

// Simple translation function (mock implementation)
async function translateText(text, targetLang) {
  // This is a mock implementation - replace with a real translation service
  // For example, you could use a free tier of a translation API
  console.log(`[MOCK] Translating to ${targetLang}: ${text.substring(0, 30)}...`);
  await sleep(500); // Simulate API call delay
  return `[${targetLang.toUpperCase()}] ${text}`;
}

async function translateFile(sourcePath, targetLang) {
  try {
    const sourceContent = readJsonFile(sourcePath);
    const translatedContent = {};

    for (const [key, value] of Object.entries(sourceContent)) {
      if (typeof value === 'string') {
        try {
          console.log(`Translating "${key}" to ${targetLang}...`);
          const translatedText = await translateText(value, targetLang);
          translatedContent[key] = translatedText;
          console.log('  ->', translatedText);
          await sleep(RATE_LIMIT_DELAY);
        } catch (error) {
          console.error(`Error translating key "${key}":`, error.message);
          translatedContent[key] = value;
        }
      } else {
        translatedContent[key] = value;
      }
    }

    return translatedContent;
  } catch (error) {
    console.error('Error in translateFile:', error.message);
    return null;
  }
}

async function translateAll() {
  const sourceDir = path.join(localesPath, sourceLanguage);
  
  if (!fs.existsSync(sourceDir)) {
    console.error('Source directory not found:', sourceDir);
    return;
  }

  const targetLangs = fs.readdirSync(localesPath)
    .filter(lang => lang !== sourceLanguage && 
            fs.statSync(path.join(localesPath, lang)).isDirectory());

  if (targetLangs.length === 0) {
    console.log('No target languages found. Please create language directories in public/locales/');
    return;
  }

  console.log('Found target languages:', targetLangs.join(', '));

  for (const file of fs.readdirSync(sourceDir)) {
    const sourcePath = path.join(sourceDir, file);
    const ext = path.extname(file);
    
    if (ext !== '.json') continue;

    console.log('\nProcessing file:', file);

    for (const lang of targetLangs) {
      const targetDir = path.join(localesPath, lang);
      const targetPath = path.join(targetDir, file);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      console.log('\nTranslating to', lang + '...');
      const translated = await translateFile(sourcePath, lang);

      if (translated) {
        fs.writeFileSync(
          targetPath,
          JSON.stringify(translated, null, 2),
          'utf8'
        );
        console.log('Successfully translated to', lang, 'and saved to', targetPath);
      }
    }
  }
}

// Install required packages first
console.log('Installing required packages...');
require('child_process').execSync('npm install i18next i18next-fs-backend', { stdio: 'inherit' });

// Run translation
translateAll().catch(console.error);