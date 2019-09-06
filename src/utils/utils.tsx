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