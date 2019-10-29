const str='紫    （笑） ))))) '
    const emoReg = /(?<=[\(|（])[^\(\)|）]*(?=[\)|）])/g
    const nameReg = /^(.*)(?:\s*)(?=[\(|（])/g
    const emotion = str.match(emoReg)
    const name = str.match(nameReg)
    console.log(emotion,name)
