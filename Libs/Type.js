/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/helper
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const _typeArr = v => Array.isArray(v)
const _typeObj = v => typeof v == 'object' && v !== null && !_typeArr(v)
const _typeStr = v => typeof v == 'string'
const _typeNeStr = v => _typeStr(v) && v !== ''
const _typeNum = v => typeof v == 'number' && v !== Infinity && !isNaN(v)
const _typeBool = v => typeof v == 'boolean'
const _typeFunc = v => typeof v == 'function' && v.constructor.name !== 'AsyncFunction'
const _typeAsyncFunc = v => typeof v == 'function' && v.constructor.name === 'AsyncFunction'
const _typePromise = v => _typeObj(v) && v instanceof Promise
const _typeError = v => _typeObj(v) && v instanceof Error

module.exports = {
  obj: _typeObj,
  str: _typeStr,
  neStr: _typeNeStr,
  num: _typeNum,
  bool: _typeBool,
  arr: _typeArr,
  func: _typeFunc,
  asyncFunc: _typeAsyncFunc,
  promise: _typePromise,
  err: _typeError,
}