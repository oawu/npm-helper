/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/helper
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Type = require('./Type.js')

const Argv = {
  dash: _ => { // -a b c --d ef
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
  },
  query: keys => { // a=b-c=d e=123
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
  },
}

module.exports = Argv
