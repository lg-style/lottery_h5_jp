const fs = require('fs');
const path = require('path');
const translate = require('@vitalets/google-translate-api');

const SOURCE_FILE = path.resolve(__dirname, '../src/lang/zh.js');
const TARGET_LOCALE = process.argv[2] || 'ja';
const OUTPUT_FILE = path.resolve(__dirname, `../src/lang/${TARGET_LOCALE}.js`);

const zhLocale = require(SOURCE_FILE);
const cache = new Map();
let totalCount = 0;
let translatedCount = 0;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function countStrings(obj) {
  if (typeof obj === 'string') {
    totalCount++;
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach(item => countStrings(item));
  } else if (typeof obj === 'object' && obj !== null) {
    Object.values(obj).forEach(value => countStrings(value));
  }
}

async function translateText(text) {
  if (typeof text !== 'string' || text.trim() === '') {
    return text;
  }
  // 只跳过纯数字、纯符号，保留中文内容进行翻译
  if (/^[\d\s\-+.,;:!?()\[\]{}]+$/.test(text)) {
    return text;
  }
  if (cache.has(text)) {
    return cache.get(text);
  }
  let attempt = 0;
  while (attempt < 3) {
    try {
      const res = await translate(text, {
        from: 'zh-CN',
        to: TARGET_LOCALE === 'ja' ? 'ja' : TARGET_LOCALE,
      });
      const translated = res.text;
      cache.set(text, translated);
      translatedCount++;
      if (translatedCount % 10 === 0) {
        process.stdout.write(`\rProgress: ${translatedCount}/${totalCount} (${Math.round(translatedCount/totalCount*100)}%)`);
      }
      await delay(200); // 增加延迟避免请求过快
      return translated;
    } catch (err) {
      attempt += 1;
      if (attempt >= 3) {
        console.warn(`\nFailed to translate: "${text.substring(0, 50)}..."`);
        cache.set(text, text); // 失败时保留原文
        return text;
      }
      await delay(1000 * attempt);
    }
  }
  cache.set(text, text);
  return text;
}

async function processValue(value) {
  if (Array.isArray(value)) {
    const arr = [];
    for (const item of value) {
      arr.push(await processValue(item));
    }
    return arr;
  }
  if (typeof value === 'object' && value !== null) {
    const obj = {};
    for (const key of Object.keys(value)) {
      obj[key] = await processValue(value[key]);
    }
    return obj;
  }
  return await translateText(value);
}

async function main() {
  console.log(`Translating zh.js -> ${TARGET_LOCALE}.js ...`);
  console.log('Counting strings to translate...');
  countStrings(zhLocale);
  console.log(`Total strings: ${totalCount}\n`);
  
  const translated = await processValue(zhLocale);
  console.log(`\n\nTranslation completed: ${translatedCount}/${totalCount} strings translated`);
  const content = `module.exports = ${JSON.stringify(translated, null, 2)};\n`;
  fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
  console.log(`File saved: ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

