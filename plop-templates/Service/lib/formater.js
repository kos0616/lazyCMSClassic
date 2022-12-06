/**
 * 將說明轉換為 typeScript 的描述
 * @param {{key: string,
    type: string,
    required: boolean,
    id: string,
    intro: string,
    memo: string
    spec: {}
  }[]} form 欄位項目
 */
function generateType(form) {
  return form
    .map((f) => [
      /** 上方註解 */
      `/** ${f.intro} ${f.memo} ${f.required ? "必填" : "選填"} */`,
      /** 下方 type script */
      `${f.id}${f.required ? "" : "?"}: ${getOpt(f.spec.options) || f.type}${
        f.spec.isArray ? "[]" : ""
      };`,
    ])
    .reduce((cur, nex) => [...cur, ...nex], []);
}

function generateSearchType(form) {
  return form
    .map((f) => [
      /** 上方註解 */
      `/** ${f.intro} ${f.memo} */`,
      /** 下方 type script */
      `search_${f.id}?: ${getOpt(f.spec.options) || f.type}${
        f.spec.isArray ? "[]" : ""
      };`,
    ])
    .reduce((cur, nex) => [...cur, ...nex], []);
}

function generateSearchTypeFormater(form) {
  return form
    .map((f) => [`search_${f.id}: req ? req.search_${f.id} : undefined,`])
    .reduce((cur, nex) => [...cur, ...nex], []);
}

/**
 * 取得選項
 * @param {{key:string,value:string}[]} opt
 */
function getOpt(opt) {
  if (Array.isArray(opt) && opt.length) {
    const keys = opt.map((o) => o.key);
    /** 檢查是否為 status '3' | '-2' 的情況 */
    const isStatus =
      keys.length === 2 && keys.includes("3") && keys.includes("-2");
    if (isStatus) return "status";

    /** 其餘狀況，印出 options */
    return keys.map((s) => `'${s}'`).join(" | ");
  }
}

module.exports = {
  generateType,
  generateSearchType,
  generateSearchTypeFormater,
};
