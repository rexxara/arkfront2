// const reg = /\$\{[^}]+\}/g
// const data = {
//     userName: 'rex',
//     pw: '111111'
// }
// let str = "?????${userName},hhahahahh${pw}123312{不匹配}"
// const res=str.replace(reg, function (rs) {
//     const key=rs.slice(2,rs.length-1)
//     console.log(key)
//     return data[key]
// })
// console.log(res)

let str=`A

B`
for(let i=0;i<str.length;i++){
    console.log(str.charCodeAt(i))
}