/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/helper
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

module.exports = {
  cn: _ => process.stdout.write("\x1b[2J\x1b[0f"),
  ln: (...strs) => process.stdout.write(`${strs.join('')}\n`)
}
