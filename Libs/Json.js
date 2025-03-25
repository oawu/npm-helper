/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/helper
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

module.exports = {
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
  }
}
