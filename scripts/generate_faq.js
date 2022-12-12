"use strict";

const path = require("path");
const fs = require("fs-extra");
const parseMd = require("./parse_md.js");

const BASE = process.cwd();

const downloadJson = require(path.join(BASE, "config/download.json"));

const faqVersions = [];

const parseFaq = (str) => {
  const arr = [...str.matchAll(/<h2>Q[：| :](.*?)<\/h2>/g)];
  const data = [];
  let startIndex = 0;
  arr.forEach((item, index) => {
    data.push({
      q: item[0],
    });
    if (index !== 0) {
      data[index - 1].a = str.slice(startIndex, item.index);
    }
    startIndex = item[0].length + item.index;
  });
  data.at(-1).a = str.slice(startIndex);
  return data;
};

const parseFiles = (docPath, version, lang) => {
  const docFiles = fs.readdirSync(docPath);
  let faqSearchData = [];
  docFiles.forEach((file) => {
    const filePath = `${docPath}/${file}`;
    const fileStat = fs.statSync(filePath);
    if (fileStat.isDirectory()) {
      if (file === "contribute") return;
      parseFiles(filePath, version, lang);
      return;
    }
    const extension = path.extname(file);
    if (fileStat.isFile() && [".md", ".markdown"].includes(extension)) {
      const fileInfo = path.parse(filePath);
      if (fileInfo.name !== "faq") {
        return;
      }
      const result = parseMd(filePath);

      faqSearchData = faqSearchData.concat(
        [...parseFaq(result["__html"])].map((item) => ({
          time: downloadJson[version]?.time,
          version,
          ...item,
        }))
      );

      const targetFaqDataPath = `${BASE}/public/fetch/faq/${lang}`;
      fs.ensureDirSync(targetFaqDataPath);
      fs.writeFileSync(
        `${targetFaqDataPath}/${version}.json`,
        JSON.stringify(parseFaq(result["__html"]), null, 2, "utf8")
      );
      if (lang === "en-us") faqVersions.push(version);
    }
  });
  const targetFaqPath = `${BASE}/public/data/faq/${lang}.json`;
  fs.ensureFileSync(targetFaqPath);
  fs.writeFileSync(
    targetFaqPath,
    JSON.stringify(faqSearchData, null, 2, "utf8")
  );
};

const parseDoc = (dir, lang) => {
  const versionFiles = fs.readdirSync(dir);
  versionFiles.forEach((version) => {
    const docsPath = path.join(dir, version, "user_doc");
    parseFiles(docsPath, version, lang);
  });
  const faqVersionPath = `${BASE}/public/fetch/faq`;
  fs.ensureDirSync(faqVersionPath);
  fs.writeFileSync(
    `${faqVersionPath}/version.json`,
    JSON.stringify(faqVersions, null, 2, "utf8")
  );
};

const generateDoc = () => {
  parseDoc(`${BASE}/docs/en-us`, "en-us");
  parseDoc(`${BASE}/docs/zh-cn`, "zh-cn");
};

module.exports = generateDoc;
