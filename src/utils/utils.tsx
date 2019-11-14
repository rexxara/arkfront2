export function strlen(str: string = "") {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    //单字节加1 
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++;
    }
    else {
      len += 2;
    }
  }
  return len;
}

// export function ToDBC(txtstring: string) {
//   var tmp = "";
//   for (var i = 0; i < txtstring.length; i++) {
//     if (txtstring.charCodeAt(i) == 32) {
//       tmp = tmp + String.fromCharCode(12288);
//     }
//     if (txtstring.charCodeAt(i) < 127) {
//       tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i) + 65248);
//     }
//   }
//   return tmp;
// }
export const emotionProcessor = (str: string) => {
  const emoReg = /(?<=[\(|（])[^\(\)|）]*(?=[\)|）])/g
  const nameReg = /^(.*)(?:\s*)(?=[\(|（])/g
  const emotion = str.match(emoReg)
  const name = str.match(nameReg)
  if (emotion && name) {
    return {
      name: name[0].trim(),
      emotionKey: emotion[0].trim()
    }
  } else {
    return { name: str, emotionKey: 'default' }
  }
}
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function filterSpace(str: string): string {
  return str.replace(/\s/g, '')
}
export function b64_to_utf8(str: string) {
  return decodeURIComponent(escape(window.atob(str)))
}
export function isArrayEqual(arr: number[], currentSpaceLine: number[]) {
  if (arr.length !== currentSpaceLine.length) {
    return false
  }
  const res = arr.find((v, k) => {
    return v !== currentSpaceLine[k]
  })
  return res ? false : true
}
export function getValueByObjKeyValue(object: any, kkey: string, value: any) {
  let res = {}
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const element = object[key]
      if (element[kkey] === value) {
        res = element
        break
      }
    }
  }
  return res
}