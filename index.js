/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/helper
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Type = require('./Libs/Type.js')
const Json = require('./Libs/Json.js')
const Print = require('./Libs/Print.js')
const Argv = require('./Libs/Argv.js')
const Str = require('./Libs/Str.js')

const Sigint = {
  _funcs: [],
  execute(done = null, closure = null) {
    return promisify(closure, async _ => {
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

const promisify = (closure, func, obj = undefined) => {
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

const tryFunc = async (func, ifCatchVal = undefined) => {
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

const date = (format = 'Y-m-d H:i:s', now = new Date()) => format.replace('Y', now.getFullYear()).replace('m', Str.pad(now.getMonth() + 1)).replace('d', Str.pad(now.getDate())).replace('H', Str.pad(now.getHours())).replace('i', Str.pad(now.getMinutes())).replace('s', Str.pad(now.getSeconds()))

module.exports = {
  Type,
  Json,
  Print,
  Argv,
  Sigint,
  Str,
  promisify,
  tryFunc,
  date,
}
