const formater = require("../../Service/lib/formater");
const { generateType, generateSearchType, generateSearchTypeFormater } =
  formater;

/*
  form: 
  {{key: string,
  type: string,
  required: boolean,
  id: string,
  intro: string,
  memo: string,
  spec: {
    memo: boolean,
    options: {value:string, label:string}
  }}[]} */

/** 建立 router 與 *vue 檔 */
module.exports = (D) => {
  const BASE = D.API.replace(/(\/lists|\/create|\/doCreate)/, "");
  const BASE_NAME = BASE.replace("/", "-");

  const ARR = BASE.split("/");
  const ROUTER_FIRST = ARR[0];
  const ROUTER_LAST = ARR[1];

  /** 清掉最後一段的 lists */
  const BASE_API = D.API.replace(/(\/lists|\/create|\/doCreate)/, "");
  const types = generateType(D.form);
  /** 列表搜尋參數 */
  const searchTypes = generateSearchType(D.form);
  /** 列表搜尋送出前的格式化 */
  const searchTypesFormater = generateSearchTypeFormater(D.form);

  const data = {
    ...D,
    BASE_NAME,
    BASE,
    ROUTER_FIRST,
    ROUTER_LAST,
    BASE_API,
    types,
    searchTypes,
    searchTypesFormater,
    subList: true,
  };

  /* ROUTER NEED: account/manage/lists, module_account-name, cutted path, key */

  const actions = [
    {
      type: "add", //类型创建模板文件
      force: true, // 檔案重複時，強制覆蓋
      path: `dist/SelectorTableTheme/components/${ROUTER_LAST}Lists.vue`, //文件创建路径
      templateFile: "plop-templates/view/SelectorTableTheme/lists.hbs", //文件模板
      data,
    },
    {
      type: "add", //类型创建模板文件
      force: true, // 檔案重複時，強制覆蓋
      path: `dist/SelectorTableTheme/Service/${ROUTER_LAST}Lists.ts`, //文件创建路径
      templateFile: "plop-templates/Service/Lists.hbs", //文件模板
      data,
    },
    {
      type: "add", //类型创建模板文件
      force: true, // 檔案重複時，強制覆蓋
      path: `dist/_locale.json`, //文件创建路径
      templateFile: "plop-templates/view/SelectorTableTheme/locale.hbs", //文件模板
      data,
    },
  ];
  return actions;
};
