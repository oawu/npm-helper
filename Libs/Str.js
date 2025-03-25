/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/helper
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

module.exports = {
  pad: (t, l = 2, s = '0', r = false) => r ? String(t).padEnd(l, s) : String(t).padStart(l, s),
}
