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

export function getDomAttribute(id: string, key: string, dataType: string): any {
  const dataCon = document.getElementById(id)
  let data = ""
  if (dataCon) {
    data = dataCon.getAttribute(key) || ""
  }
  switch (dataType) {
    case "int":
      let res = parseInt(data)
      if (isNaN(res)) {
        res = 0
        console.warn('value is NaN,automatically return 0')
      }
      return res
    case "bool":
      return data === "true" ? true : false
    case 'displayCharacters':
      if (data.length) {
        let characters = data.split(';').filter(v=>v)
        return characters.map(v => {
          if (v) {
            const res = v.split(":")
            return { name: res[0], emotion: res[1] }
          }
        })
      }else{
        return []
      }
    default:
      return data
  }
}
export function setDomAttribute(id: string, key: string, value: any,type?:string): any {
  const dataCon = document.getElementById(id)
  if (dataCon) {
    switch (type) {
      case 'displayCharacters':
          let dataStr = ''
          value.map(v => {
              dataStr += `${v.name}:${v.emotion};`
          })
          dataCon.setAttribute(key, dataStr)
        break;
      default:
          dataCon.setAttribute(key, value)
        break;
    }
  } else {
    console.error('no such element!')
  }
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}