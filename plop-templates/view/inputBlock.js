/** 
 * input 共用區塊的子片段
 * :7 判斷 options 的長度是否為 2 => 轉為 el-switch
 * :15 判斷 options 是否有長度 => 轉為 el-select
 * :28 一般狀態 轉為 el-input
 */
module.exports = 
`{{#isSwitch this.spec.options}}
<el-switch
  v-model="form[inputForm.{{this.key}}.id]"
  :active-value="inputForm.{{this.key}}.options[0].value"
  :inactive-value="inputForm.{{this.key}}.options[1].value"
  inactive-color="#ff4949"
  active-color="#13ce66"
/>
{{else if this.spec.options.length}}
<el-select
  v-model="form[inputForm.{{this.key}}.id]"
  :placeholder="$t(inputForm.{{this.key}}.label)"
>
  <el-option
    v-for="(item, i) in inputForm.{{this.key}}.options"
    :key="\`{{this.key}}_\${i}\`"
    :label="$t(item.label)"
    :value="item.value"
  />
</el-select>
{{else}}
<el-input
  v-model="form[inputForm.{{this.key}}.id]"
  :placeholder="$t(inputForm.{{this.key}}.label)"
  {{#if this.spec.memo}}
  type="textarea"
  {{/if}}
/>
{{/isSwitch}}
`;