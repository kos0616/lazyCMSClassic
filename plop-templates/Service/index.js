const formater = require("./lib/formater");
const { generateType, generateSearchType, generateSearchTypeFormater } =
  formater;

/** 建立 Service/*ts */
module.exports = (D) => {
  /** 清掉最後一段的 lists */
  const BASE_API = D.API.replace(/(\/lists|\/create|\/doCreate)/, "");
  const types = generateType(D.form);
  /** 列表搜尋參數 */
  const searchTypes = generateSearchType(D.form);
  /** 列表搜尋送出前的格式化 */
  const searchTypesFormater = generateSearchTypeFormater(D.form);

  const data = {
    ...D,
    BASE_API,
    types,
    searchTypes,
    searchTypesFormater,
  };

  const actions = [
    {
      type: "add", //类型创建模板文件
      force: true, // 檔案重複時，強制覆蓋
      path: `dist/${data.folder}/Service/Create.ts`, //文件创建路径
      templateFile: "plop-templates/Service/Create.hbs", //文件模板
      data,
    },
    {
      type: "add", //类型创建模板文件
      force: true, // 檔案重複時，強制覆蓋
      path: `dist/${data.folder}/Service/Delete.ts`, //文件创建路径
      templateFile: "plop-templates/Service/Delete.hbs", //文件模板
      data,
    },
    {
      type: "add", //类型创建模板文件
      force: true, // 檔案重複時，強制覆蓋
      path: `dist/${data.folder}/Service/DoModify.ts`, //文件创建路径
      templateFile: "plop-templates/Service/DoModify.hbs", //文件模板
      data,
    },
    {
      type: "add", //类型创建模板文件
      force: true, // 檔案重複時，強制覆蓋
      path: `dist/${data.folder}/Service/Info.ts`, //文件创建路径
      templateFile: "plop-templates/Service/Info.hbs", //文件模板
      data,
    },
    {
      type: "add", //类型创建模板文件
      force: true, // 檔案重複時，強制覆蓋
      path: `dist/${data.folder}/Service/Lists.ts`, //文件创建路径
      templateFile: "plop-templates/Service/Lists.hbs", //文件模板
      data,
    },
    {
      type: "add", //类型创建模板文件
      force: true, // 檔案重複時，強制覆蓋
      path: `dist/${data.folder}/Service/Modify.ts`, //文件创建路径
      templateFile: "plop-templates/Service/Modify.hbs", //文件模板
      data,
    },
  ];
  return actions;
};
