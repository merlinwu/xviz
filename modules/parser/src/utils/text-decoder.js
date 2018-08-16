// Copyright (c) 2019 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// The MIT License (MIT) Copyright (c) 2016 Till Affeldt
/* global window */

// allowed encoding strings for utf-8
const utf8Encodings = ['utf8', 'utf-8', 'unicode-1-1-utf-8'];

class TextDecoderPolyfill {
  constructor(encoding, options) {
    if (
      utf8Encodings.indexOf(encoding) < 0 &&
      typeof encoding !== 'undefined' &&
      encoding !== null
    ) {
      throw new RangeError('Invalid encoding type. Only utf-8 is supported');
    } else {
      this.encoding = 'utf-8';
      this.ignoreBOM = false;
      this.fatal = typeof options !== 'undefined' && 'fatal' in options ? options.fatal : false;
      if (typeof this.fatal !== 'boolean') {
        throw new TypeError('fatal flag must be boolean');
      }
    }
  }

  decode(view, options) {
    if (typeof view === 'undefined') {
      return '';
    }

    const stream = typeof options !== 'undefined' && 'stream' in options ? options.stream : false;
    if (typeof stream !== 'boolean') {
      throw new TypeError('stream option must be boolean');
    }

    if (!ArrayBuffer.isView(view)) {
      throw new TypeError('passed argument must be an array buffer view');
    } else {
      const arr = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
      const charArr = new Array(arr.length);
      arr.forEach((charcode, i) => {
        charArr[i] = String.fromCharCode(charcode);
      });
      return decodeURIComponent(escape(charArr.join('')));
    }
  }
}

export const TextDecoder = typeof window !== 'undefined' ? window.TextDecoder : TextDecoderPolyfill;
