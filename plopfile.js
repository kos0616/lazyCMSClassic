/** 取得文件轉換過來的值 */
const inputs = require("./lib/fileReader");
const API = inputs.API_PATH.trim();
const API_AUTH = inputs.API_AUTH.trim();
const form = inputs.settedForm;
const { key, NODE, CHUNK } = inputs;
const folder = API.split("/")[1]; /* 過濾出 folder 的路徑 */
// test
/** 整理問題 */
const setPrompts = require("./lib/setPrompts");
/** Service 後端溝通相關設定 */
const Service = require("./plop-templates/Service/index");
/** 共用項目設定 */
const Core = require("./plop-templates/view/Core/index");
/** 基礎連結式 vue */
const BasicTheme = require("./plop-templates/view/BasicTheme/index");
/** 彈跳式 vue */
const DialogTheme = require("./plop-templates/view/DialogTheme/index");
/** 次級選擇列表 */
const SelectorTableTheme = require("./plop-templates/view/SelectorTableTheme/index");

const FOLDER = {
  description: "API 文件轉為資料夾並且輸出",
  prompts: [...setPrompts(API, form, key)],
  actions: (data) => {
    /** 印出欄位 */
    console.log("\n");
    console.table(form);

    if (data.confirm === false)
      throw new Error("使用者確認欄位錯誤，中斷操作!");
    const res = { API, API_AUTH, ...data, folder, key, form, NODE, CHUNK };

    if (data.themeType === "SelectorTable") {
      return [...setTheme(data.themeType, res)];
    }

    const actions = [
      ...Service(res),
      ...Core(res),
      ...setTheme(data.themeType, res),
    ];
    return actions;
  },
};

const inputBlock = require("./plop-templates/view/inputBlock");

module.exports = function (plop) {
  /** 判定是否可用 el-switch */
  plop.setHelper("isSwitch", function (arr, opts) {
    return Array.isArray(arr) && arr.length === 2
      ? opts.fn(this)
      : opts.inverse(this);
  });

  plop.setPartial("inputPartial", inputBlock);

  plop.setGenerator("FOLDER", FOLDER);
};

/**
 * 取得樣式
 * @param {'Basic' | 'Dialog'} themeType 外觀樣式的類型
 * @returns
 */
function setTheme(themeType, res) {
  let Theme = [];

  if (themeType === "Dialog") {
    Theme = DialogTheme(res);
  }
  if (themeType === "Basic") {
    Theme = BasicTheme(res);
  }
  if (themeType === "SelectorTable") {
    Theme = SelectorTableTheme(res);
  }
  return Theme;
}
