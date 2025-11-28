import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { Locale } from 'vant';
import zhCN from 'vant/lib/locale/lang/zh-CN';
import jaJP from 'vant/lib/locale/lang/ja-JP';

import zh from './zh';
import ja from './ja';

Vue.use(VueI18n);

const messages = {
  zh,
  ja,
};

let savedLocale = localStorage.getItem('locale') || 'zh';
// 如果之前选择的是英文，回退到中文
if (savedLocale === 'en') {
  savedLocale = 'zh';
  localStorage.setItem('locale', 'zh');
}

const i18n = new VueI18n({
  locale: savedLocale,
  fallbackLocale: 'zh',
  messages,
});

const vantLocales = {
  zh: { name: 'zh-CN', config: zhCN },
  ja: { name: 'ja-JP', config: jaJP },
};

function applyVantLocale(locale) {
  const target = vantLocales[locale] || vantLocales.zh;
  Locale.use(target.name, target.config);
}

applyVantLocale(i18n.locale);

export function setLocale(locale) {
  if (!messages[locale]) {
    return;
  }
  if (i18n.locale === locale) {
    return;
  }
  i18n.locale = locale;
  localStorage.setItem('locale', locale);
  applyVantLocale(locale);
}

export const availableLocales = [
  { label: '简体中文', value: 'zh' },
  { label: '日本語', value: 'ja' },
];

export default i18n;

