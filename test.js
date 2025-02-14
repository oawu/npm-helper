/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/helper
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Helper = require('./index.js')
Helper.Print.ln('Hi~')

Helper.Sigint.push(_ => {
  console.error('a');
})

Helper.Sigint.push(async _ => await new Promise(resolve => setTimeout(_ => {
  console.error('b');
  resolve()
}, 1000)))

Helper.Sigint.execute()
  .then(_ => {
    console.error('ok');
  })