import fs from "fs";

fs.writeFileSync("hello.txt", "hello from ts-node-dev");

const a: number = 2;
console.log(a);
