const fs = require("fs");
const path = require("path");
const paper = fs.readFileSync(path.resolve(__dirname, "../MD.txt"), "utf8");

/* FUTURE: DATUM 以及 object in object */

/** get NODE */
const NODE_Matcher = paper.match(/NODE_\d*/);
let NODE = "NODE_**";
if (Array.isArray(NODE_Matcher) && NODE_Matcher.length) {
  NODE = NODE_Matcher[0];
}

/** 依照 PKG Name 來命名 Chunk */
const CHUNK_CONTENT = paper.match(/[c]{0,1}PKG-\d*-\w*/)[0];
const CHUNK = CHUNK_CONTENT.split("-")[2];

/** 以關鍵字取得權限 */
const API_AUTH_CONTENT = paper.match(/權限\S* \S*\/lists/)[0];
/** 再度過濾，取得 /lists */
const API_AUTH = API_AUTH_CONTENT.match(/\S*\/lists/)[0];

/** 取得 API 用的路徑 */
const API_PATH_CONTENT = paper.match(/路徑\t[\S]*/)[0];
const API_PATH = API_PATH_CONTENT.match(
  /[a-zA-Z\-]*\/[a-zA-Z\-]*\/(lists|create|doCreate)/
)[0];

/** 取得含有關鍵字的表格內項目 */
const aviabledData = paper.match(
  /[c]{0,1}p\d*_[a-z]*_[a-z0-9_\[\]]*\t[\S ]*\t[\S | \t]*/gm
);

/** 將每列再切成小塊 */
const table = aviabledData.map((R) => R.split("\t").map((s) => s.trim()));

/**
 * 自動找出手動輸入的 key
 * 原理是找出 'id' 結尾的 key
 */
const keyMatcher = paper.match(/[c]{0,1}p\d*_[a-z]*_[a-z_]*id/g);
let KEY = "";
if (Array.isArray(keyMatcher) && keyMatcher.length > 0) {
  KEY = keyMatcher[0];
}

/** Main key 為 router 切換與刪除使用的 key */
console.log("\x1b[34m", `Main Key: ${KEY}`);
/** Name Key 為刪除時的預設提示 key */
console.log("\x1b[34m", `Name Key: ${table[0]}`);

/**
 * 從 table 轉譯成文字
 * 第一格固定為 內容 第二格固定為 說明 ，第三格後為驗證
 */
const rawForm = table.map((row) => {
  const [id, intro, ...res] = row;
  const memo = res.filter((R) => R).join(", ");
  return { id, intro, memo };
});

/** 開始進行欄位的格式化 */
const settedForm = rawForm
  .map((raw, index, arr) => {
    let id = raw.id;
    const key = showKey(raw);
    const type = keyIsNumber(raw) ? "number" : "string";
    const required = IsRequired(raw);
    const isFlatArr = isFlatArray(raw);
    const spec = {
      memo: isMemo(raw),
      options: getSelection(raw),
      isArray: isFlatArr,
    };

    if (isFlatArr) {
      const preIndex = index - 1;
      const prevId = arr[preIndex].id;
      /** 檢查上一筆 */
      const isSameId = raw.id.includes(prevId);
      if (isSameId) {
        id = prevId;
      } else {
        id = id.replace(/\[\]$/gm, "");
      }
    }
    return { key, type, required, ...raw, spec, id };
  })
  .filter(repeatedKey);

console.table(settedForm);

exports.NODE = NODE;
/** 打包的命名 */
exports.CHUNK = CHUNK;
/** 權限指定路徑 */
exports.API_AUTH = API_AUTH;
exports.API_PATH = API_PATH;
/** 解析過後的文件 */
exports.settedForm = settedForm;
/** 手動置入的 KEY 值 */
exports.key = KEY;
/**
 * 檢查欄位是否為 Number
 * @param { {id:string,intro:string,memo:string} } raw 基本資料類型
 * @returns boolean
 */
function keyIsNumber(raw) {
  /** 單從 id 名稱判斷 */
  const keyTest = raw.id.includes("id");

  const NUMBER_TYPES = ["number", "integer", "unix"];
  /** 從驗證與備註中的關鍵字做判斷 */
  const memoTest = NUMBER_TYPES.some((T) => raw.memo.includes(T));
  return keyTest || memoTest;
}

/**
 * 檢查欄位是否為 required
 * 先檢查 nullabled, 再來是 必填 與 required 關鍵字
 * @param { {id:string,intro:string,memo:string} } raw 基本資料類型
 * @returns boolean
 */
function IsRequired(raw) {
  /* 再檢查必填 */
  const REQUIRED_STRINGS = ["required", "必填"];
  const required = REQUIRED_STRINGS.some(
    (S) => raw.memo.includes(S) || raw.intro.includes(S)
  );
  return required;
}

/**
 * 將欄位id格式化，以取得簡寫代稱
 * 方法是將 pxx_xx_ 除掉，以後方的詞作為 key
 * @param { {id:string,intro:string,memo:string} } raw 基本資料類型
 * @returns string
 */
function showKey(raw) {
  const str = raw.id.replace(/[c]{0,1}p\d*_[a-z]*_/gm, "");
  /** 過濾單維陣列型態的KEY，其尾端的括弧 */
  const setSquareBrackets = str.replace(/\[\]$/gm, "");
  /** 一般的 key 命名 */
  if (setSquareBrackets !== "id") return setSquareBrackets;
  return raw.id.replace(/[c]{0,1}p\d*_/gm, "").replace(/\[\]$/gm, "");
}

/**
 * 檢查欄位是否為 備註
 * @param { {id:string,intro:string,memo:string} } raw 基本資料類型
 * @returns boolean
 */
function isMemo(raw) {
  /** 單從 id 名稱判斷 */
  const keyTest = raw.id.includes("_memo") || raw.id.includes("_notice");
  const MEMO_TYPES = ["備註"];
  const memoTest = MEMO_TYPES.some((T) => raw.memo.includes(T));
  return keyTest || memoTest;
}

/**
 * 取得欄位的選項
 * @param { {id:string,intro:string,memo:string} } raw 基本資料類型
 * @returns boolean
 */
function getSelection(raw) {
  /** 以句點 作為判斷的依據， 注意中文字元判斷在 regex101 無法作用 */
  const regex = new RegExp(
    /[-]{0,1}[a-zA-Z0-9]*\.[a-zA-Z0-9\u4e00-\u9fa5]*/,
    "gm"
  );
  /** 這邊會取得文件中的值與名稱 ex: ['3.啟用', '-2.停用'] */
  const result = raw.memo.match(regex);
  /** 滿足條件的話，轉成 Array<{key:string, value:string}> */
  if (Array.isArray(result) && result.length >= 2) {
    return result.map((R) => {
      const arr = R.split(".");
      return {
        key: arr[0],
        value: arr[1],
      };
    });
  }
}

/**
 * 檢查類型是否為一維陣列型態
 * @param { {id:string,intro:string,memo:string} } raw 基本資料類型
 * @returns boolean
 */
function isFlatArray(raw) {
  /** 只檢查一維平面陣列，因此length 必須為 1 */
  const matcher = raw.id.match(/\[\]/gm);
  return matcher && matcher.length === 1;
}

/**
 * 移除重複的id，因一維陣列型態時，宣告用的key與其後方的key會重複，且只需要保留其一
 * @param {{id:string}} data
 * @param {number} i
 * @param {{id:string}[]} arr
 * @returns boolean
 */
function repeatedKey(data, i, arr) {
  const next = arr[i + 1];
  const nextId = next?.id;
  if (nextId === data.id && next.spec.isArray) {
    return false;
  }
  return true;
}
