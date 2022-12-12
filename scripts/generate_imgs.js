const path = require('path');
const fs = require('fs-extra');

const BASE = process.cwd();

const copyImg = (dir) => {
  const imgDirPath = path.join(BASE, dir, '/img');
  const imgs = fs.readdirSync(imgDirPath);
  imgs.forEach((img) => {
    const imgSourcePath = `${imgDirPath}/${img}`;
    const imgTargetPath = `${BASE}/public/img/${img}`;
    const imgStat = fs.statSync(imgSourcePath);
    if (imgStat.isDirectory()) {
      fs.ensureDirSync(imgTargetPath);
    } else {
      fs.ensureFileSync(imgTargetPath);
    }
    fs.copySync(imgSourcePath, imgTargetPath);
  });
};

copyImg('events');
copyImg('blog');
