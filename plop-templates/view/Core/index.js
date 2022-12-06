/* {{key: string,
  type: string,
  required: boolean,
  id: string,
  intro: string,
  memo: string}[]} */

/** 建立 必須的 form 與 語系 以及共通的 advSearch */
module.exports = (D) => {
  const BASE = D.API.replace(/(\/lists|\/create|\/doCreate)/, "");
  const BASE_NAME = BASE.replace("/", "-");

  const ARR = BASE.split("/");
  const ROUTER_FIRST = ARR[0];
  const ROUTER_LAST = ARR[1];

  const data = {
    ...D,
    BASE_NAME,
    BASE,
    ROUTER_FIRST,
    ROUTER_LAST,
  };

  /* ROUTER NEED: account/manage/lists, module_account-name, cutted path, key */

  const actions = [
    {
      type: "add", //类型创建模板文件
      force: true, // 檔案重複時，強制覆蓋
      path: `dist/_locale.json`, //文件创建路径
      templateFile: "plop-templates/view/Core/locale.hbs", //文件模板
      data,
    },
    {
      type: "add", //类型创建模板文件
      force: true, // 檔案重複時，強制覆蓋
      path: `dist/${D.folder}/form.ts`, //文件创建路径
      templateFile: "plop-templates/view/Core/form.hbs", //文件模板
      data,
    },
    {
      type: "add", //类型创建模板文件
      force: true, // 檔案重複時，強制覆蓋
      path: `dist/${D.folder}/advSearch.vue`, //文件创建路径
      templateFile: "plop-templates/view/Core/advSearch.hbs", //文件模板
      data,
    },
  ];
  return actions;
};
