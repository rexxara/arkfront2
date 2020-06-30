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
export function variableLoader(text: string, variables: any): any {
  const reg = /\$\{[^}]+\}/g
  const res = text.replace(reg, function (rs) {
    const key = rs.slice(2, rs.length - 1)
    return variables[key]
  })
  return res
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
const newEmoReg = /((\(|（).*?(\)|）))/
const newNameReg = /.*?(\(|（|\:|：)/
export const emotionProcessor = (str: string) => {
  //const emoReg = /(?<=[\(|（])[^\(\)|）]*(?=[\)|）])/g
  //const nameReg = /^(.*)(?:\s*)(?=[\(|（])/g
  //const emotion = str.match(emoReg)
  //const name = str.match(nameReg)
  const newEmo = str.match(newEmoReg)
  const newName = str.match(newNameReg)

  if (newEmo && newName) {
    return {
      name: newName[0].slice(0, newName[0].length - 1),
      emotionKey: newEmo[0].slice(1, newEmo[0].length - 1)
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

export function splitFromFirstKey(str: string, key: string): string[] {
  const index = str.indexOf(key)
  if (index === -1) {
    return [str, '']
  }
  const pre = str.substring(0, index)
  const last = str.substring(index + 1)
  return [pre, last]
}