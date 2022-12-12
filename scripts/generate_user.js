const fs = require("fs-extra");
const path = require("path");

const BASE = process.cwd();

const parseUser = (lang) => {
  const userPath = path.join(BASE, "/config/user", lang);
  const users = fs.readdirSync(userPath).filter((item) => {
    const extension = path.extname(item);
    const stat = fs.statSync(`${userPath}/${item}`);
    return stat.isFile() && [".png", ".jpg", ".webp"].includes(extension);
  });
  const targetPath = `${BASE}/public/user/${lang}`;
  fs.ensureDirSync(targetPath);
  fs.copySync(userPath, targetPath);
  fs.writeFileSync(
    `${targetPath}/index.json`,
    JSON.stringify(users, null, 2, "utf8")
  );
};

const generateUser = () => {
  fs.emptyDirSync(`${BASE}/public/user`);
  parseUser("en-us");
  parseUser("zh-cn");
};

module.exports = generateUser;
