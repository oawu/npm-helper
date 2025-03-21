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

const Type = {
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

const closureOrPromise = (closure, func, obj = undefined) => {
  if (Type.func(closure)) {

    if (Type.asyncFunc(func)) {
      func().then(closure).catch(closure)
      return obj
    }

    if (Type.promise(func)) {
      func.then(closure).catch(closure)
      return obj
    }

    if (!Type.func(func)) {
      closure(func)
      return obj
    }

    let _tmp = false
    try {
      func(result => {
        if (_tmp) { return }
        _tmp = true
        closure(result)
      })
    } catch (error) {
      if (_tmp) { return }
      _tmp = true
      closure(error)
    }
    return obj
  }

  // =================

  if (Type.asyncFunc(closure)) {
    if (Type.asyncFunc(func)) {
      func().then(closure).catch(closure)
      return obj
    }

    if (Type.promise(func)) {
      func.then(closure).catch(closure)
      return obj
    }

    if (!Type.func(func)) {
      closure(func)
      return obj
    }

    let _tmp = false
    try {
      func(result => {
        if (_tmp) { return }
        _tmp = true
        closure(result)
      })
    } catch (error) {
      if (_tmp) { return }
      _tmp = true
      closure(error)
    }
    return obj
  }

  // =================

  if (Type.asyncFunc(func)) {
    return func()
  }

  if (Type.promise(func)) {
    return func
  }

  return new Promise((resolve, reject) => {
    if (!Type.func(func)) {
      return func instanceof Error
        ? reject(func)
        : resolve(func)
    }

    let _tmp = false
    try {
      func(result => {
        if (_tmp) { return }
        _tmp = true
        result instanceof Error ? reject(result) : resolve(result)
      })
    } catch (error) {
      if (_tmp) { return }
      _tmp = true
      reject(error)
    }
  })
}

const tryIgnore = async (func, ifCatchVal = undefined) => {
  if (Type.asyncFunc(func)) {
    let result = null
    try {
      result = await func()
    } catch (error) {
      result = ifCatchVal
      if (ifCatchVal === undefined) {
        result = error
      }
      if (Type.func(ifCatchVal)) {
        result = ifCatchVal(error)
      }
      if (Type.asyncFunc(ifCatchVal)) {
        result = await ifCatchVal(error)
      }
    }
    return result
  }

  if (Type.promise(func)) {
    let result = null
    try {
      result = await func
    } catch (error) {
      result = ifCatchVal
      if (ifCatchVal === undefined) {
        result = error
      }
      if (Type.func(ifCatchVal)) {
        result = ifCatchVal(error)
      }
      if (Type.asyncFunc(ifCatchVal)) {
        result = await ifCatchVal(error)
      }
    }
    return result
  }

  if (Type.func(func)) {
    let result = null
    try {
      result = func()
    } catch (error) {
      result = ifCatchVal
      if (ifCatchVal === undefined) {
        result = error
      }
      if (Type.func(ifCatchVal)) {
        result = ifCatchVal(error)
      }
      if (Type.asyncFunc(ifCatchVal)) {
        result = await ifCatchVal(error)
      }
    }
    return result
  }

  return func
}

const Json = {
  decode: text => {
    let json = null

    try {
      json = JSON.parse(text)
    } catch (error) {
      json = error
    }

    return json
  },
  encode: (json, space = 0) => {
    let text = null

    try {
      text = JSON.stringify(json, null, space)
    } catch (error) {
      text = error
    }

    return text
  },
}

const Print = {
  cn: _ => process.stdout.write("\x1b[2J\x1b[0f"),
  ln: (...strs) => process.stdout.write(`${strs.join('')}\n`)
}

const _argvDash = _ => { // -a b c --d ef
  const argvs = process.argv.slice(2)
  const cmds = {}

  let key = '';
  for (let argv of argvs) {
    if (argv[0] == '-') {
      key = argv
      if (!Type.arr(cmds[key])) {
        cmds[key] = []
      }
    } else {
      if (!Type.arr(cmds[key])) {
        cmds[key] = []
      }
      cmds[key].push(argv)
    }
  }

  return cmds
}
const _argvQuery = keys => { // a=b-c=d e=123
  const argvs = process.argv.slice(2)
  const cmds = {}

  for (let argv of argvs) {
    const index = argv.indexOf('=')
    if (index != -1) {
      const key = argv.substring(0, index)
      const value = argv.substring(index + 1)
      cmds[key] = value
    }
  }

  return cmds
}

const Argv = {
  dash: _argvDash,
  query: _argvQuery,
}

const Str = {
  pad: (t, l = 2, s = '0', r = false) => r ? String(t).padEnd(l, s) : String(t).padStart(l, s),
}
const date = (format = 'Y-m-d H:i:s', now = new Date()) => format.replace('Y', now.getFullYear()).replace('m', Str.pad(now.getMonth() + 1)).replace('d', Str.pad(now.getDate())).replace('H', Str.pad(now.getHours())).replace('i', Str.pad(now.getMinutes())).replace('s', Str.pad(now.getSeconds()))

const Sigint = {
  _funcs: [],
  execute(done = null, closure = null) {
    return closureOrPromise(closure, async _ => {
      for (const task of this._funcs) {
        if (Type.func(task)) {
          try { task() }
          catch (_) { }
        }
        if (Type.asyncFunc(task)) {
          try { await task() }
          catch (_) { }
        }
        if (Type.promise(task)) {
          try { await task }
          catch (_) { }
        }
      }

      if (Type.func(done)) {
        try { done() }
        catch (_) { }
      }
      if (Type.asyncFunc(done)) {
        try { await done() }
        catch (_) { }
      }
      if (Type.promise(done)) {
        try { await done }
        catch (_) { }
      }

      process.exit(1)
    })
  },
  push(...func) {
    this._funcs.push(...func)
    return this
  },
}

module.exports = {
  Argv,
  Print,
  closureOrPromise,
  tryIgnore,
  Json,
  Type,
  date,
  Str,
  Sigint,
}
