const fs = require(`fs`);

const readStream = fs.createReadStream(`readme4.txt`);
const wrtieStream = fs.createWriteStream(`writeme3.txt`);
readStream.pipe(wrtieStream);