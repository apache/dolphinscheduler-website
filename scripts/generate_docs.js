"use strict";

const path = require("path");
const fs = require("fs-extra");
const parseMd = require("./parse_md.js");

const BASE = process.cwd();

const downloadJson = require(path.join(BASE, "config/download.json"));

const deploymentData = {
  Standalone: [],
  "Pseudo Cluster": [],
  Cluster: [],
  Kubernetes: [],
  Cloud: [],
};

const versionData = [];
const docSearchData = {
  "en-us": [],
  "zh-cn": [],
};

const getVersion = (name) => {
  const result = name.match(/(\d+)-(\d+)-(\d+)/);
  return result[1] + "." + result[2] + "." + result[3];
};

const formateFile = (filePath) => {
  const fileContent = fs.readFileSync(filePath);
  const formatContent = fileContent
    .toString()
    .replace(/export default/, "module.exports =");
  fs.removeSync(filePath);
  fs.writeFileSync(filePath, formatContent);
};

const parseStructure = (html, index, parent) => {
  const regex = new RegExp(`<h${index}>(.*?)</h${index}>`, "g");
  const matched = [...html.matchAll(regex)];
  if (matched.length) {
    matched.forEach((match) => {
      const item = {
        title: match[1].replace(/<.*?>/g, ""),
        children: [],
      };
      item.anchor = getAnchor(item.title);
      parent.push(item);
      if (html.length && index < 7) {
        parseStructure(
          html.slice(match[2] + match[0].length),
          index + 1,
          item.children
        );
      }
    });
  }
  if (matched.length === 0 && index < 7) {
    parseStructure(html, index + 1, parent);
  }
};

const getAnchor = (name) => name.toLowerCase().replace(/\s/g, "_");

const addAnchors = (html) => {
  let index = 1;
  let str = html;
  while (index < 7) {
    const regex = new RegExp(`<h${index}>(.*?)</h${index}>`, "g");
    str = str.replace(
      regex,
      (a, b) => `<h${index} id="${getAnchor(b)}">${b}</h${index}>`
    );
    index++;
  }
  return str;
};

const getMenu = (list, data, version, lang, isDeployment, location) => {
  list.forEach((item) => {
    if (
      [
        "FAQ",
        "Older Versions",
        "Contribution",
        "历史版本",
        "贡献指南",
      ].includes(item.title)
    ) {
      return;
    }
    const temp = {
      title: item.title,
      children: [],
      location: [item.title],
    };

    if (isDeployment && lang === "en-us" && !item.children?.length) {
      const deploymentName = item.title.replace(/ Deployment/, "");
      deploymentData[deploymentName] &&
        deploymentData[deploymentName].push(version);

      if (downloadJson[version] && deploymentData[deploymentName]) {
        downloadJson[version]["deployment"]
          ? downloadJson[version]["deployment"].push(deploymentName)
          : (downloadJson[version]["deployment"] = [deploymentName]);
      }
    }

    if (location) {
      temp.location = [...location, item.title];
    }

    if (item.link && item.link.includes(version)) {
      const baseLink = item.link.split(version)[1];
      temp.key = baseLink.replace(/.html/, "").replace(/\/user_doc/, "");
      const mdPath = `${BASE}/docs/${lang}/${version}${baseLink.replace(
        /.html/,
        ".md"
      )}`;

      const mdInfo = parseMd(mdPath);
      const onlyText = mdInfo["__html"].replace(/<.*?>/g, "");

      const structure = [];
      parseStructure(mdInfo.__html, 2, structure);
      const matchedTitle = /<h1>(.*?)<\/h1>/.exec(mdInfo.__html);
      let title = "";
      if (matchedTitle !== null) {
        title = matchedTitle[1];
      } else if (structure.length) {
        title = structure[0].title;
      }
      if (onlyText) {
        docSearchData[lang].push({
          content: onlyText,
          version,
          time: downloadJson[version]?.time,
          link: temp.key,
          title,
          location: temp.location,
        });
      }
      const htmlData = {
        __html: addAnchors(mdInfo["__html"]),
        location: temp.location,
        time: downloadJson[version]?.time,
        structure,
        title,
        link: temp.key,
      };

      const targetDocPath = `${BASE}/public/pages/doc/${lang}/${version}/${temp.key}.json`;
      fs.ensureFileSync(targetDocPath);
      fs.writeFileSync(
        targetDocPath,
        JSON.stringify(htmlData, null, 2, "utf8")
      );
    }

    if (!temp.key) {
      let key = "";
      temp.location.forEach((item, i) => {
        key +=
          "/" +
          getAnchor(item) +
          (i === temp.location.length - 1 ? "" : "_menu");
      });
      temp.key = key;
    }

    if (item.children?.length) {
      getMenu(
        item.children,
        temp.children,
        version,
        lang,
        ["部署指南", "集成", "Installation", "integration"].includes(
          item.title
        ),
        temp.location
      );
      temp.key += "_menu";
    }

    data.push(temp);
  });
};

const wirteFileByLang = (data, lang, fileName) => {
  const targetPath = `${BASE}/public/fetch/doc/${lang}`;
  fs.ensureDirSync(targetPath);
  fs.writeFileSync(
    `${targetPath}/${getVersion(fileName)}.json`,
    JSON.stringify(data, null, 2, "utf8")
  );
};

const wirteDeployment = () => {
  const targetDataPath = `${BASE}/public/fetch`;
  fs.ensureDirSync(targetDataPath);
  fs.writeFileSync(
    `${targetDataPath}/deployment.json`,
    JSON.stringify(deploymentData, null, 2, "utf8")
  );
};

const wirteDownload = () => {
  const targetDataPath = `${BASE}/public/fetch`;
  fs.ensureDirSync(targetDataPath);
  fs.writeFileSync(
    `${targetDataPath}/download.json`,
    JSON.stringify(downloadJson, null, 2, "utf8")
  );
};

const wirteVersion = () => {
  fs.ensureDirSync(`${BASE}/public/fetch`);
  fs.writeFileSync(
    `${BASE}/public/fetch/version.json`,
    JSON.stringify(versionData, null, 2, "utf8")
  );
};

const wirteSearchDocData = () => {
  ["en-us", "zh-cn"].forEach((lang) => {
    const targetSearchPath = `${BASE}/public/data/doc/${lang}.json`;
    fs.ensureFileSync(targetSearchPath);
    fs.writeFileSync(
      targetSearchPath,
      JSON.stringify(docSearchData[lang], null, 2, "utf8")
    );
  });
};

const parseDocsMenu = () => {
  const sourcePath = BASE + "/config/docs";
  const docs = fs.readdirSync(sourcePath);
  docs.forEach((doc) => {
    const filePath = path.join(sourcePath, doc);
    const fileInfo = path.parse(filePath);
    formateFile(filePath);
    const fileContent = require(`/${filePath}`);
    const enUs = [];
    const zhCn = [];

    const version = getVersion(fileInfo.name);

    getMenu(fileContent["en-us"].sidemenu, enUs, version, "en-us", false);
    getMenu(fileContent["zh-cn"].sidemenu, zhCn, version, "zh-cn", false);

    versionData.push(version);

    wirteFileByLang(enUs, "en-us", fileInfo.name);
    wirteFileByLang(zhCn, "zh-cn", fileInfo.name);
  });
  wirteSearchDocData();
  wirteDeployment();
  wirteDownload();
  wirteVersion();
};

module.exports = parseDocsMenu;
