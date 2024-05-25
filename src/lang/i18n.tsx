import i18n from "i18next";
import enUsTrans from "./en.json";
import zhCnTrans from "./zh.json";
import koCnTrans from "./kr.json";
import jaCnTrans from "./ja.json";
import arCnTrans from "./ar.json";
import viCnTrans from "./vi.json";
import trCnTrans from "./tr.json";
import { initReactI18next } from "react-i18next";
import { LOCAL_KEY } from "../config";
// en = 英文，zh=中，ja=日，ko=韩，ar=阿拉伯
export const zh = "zh";
export const en = "en";
export const ko = "ko";
export const ja = "ja";
export const ar = "ar";
export const vi = "vi";
export const tr = "tr";
i18n
  .use(initReactI18next) //init i18next
  .init({
    //引入资源文件
    resources: {
      zh: {
        translation: zhCnTrans,
      },
      en: {
        translation: enUsTrans,
      },
      ko: {
        translation: koCnTrans,
      },
      ja: {
        translation: jaCnTrans,
      },
      ar: {
        translation: arCnTrans,
      },
      vi: {
        translation: viCnTrans,
      },
      tr: {
        translation: trCnTrans,
      },
    },
    //选择默认语言，选择内容为上述配置中的key，即en/zh
    // fallbackLng: "en",
    fallbackLng: window.localStorage.getItem(LOCAL_KEY) || "en",
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
