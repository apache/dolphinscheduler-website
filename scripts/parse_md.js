"use strict";

const path = require("path");
const fs = require("fs-extra");
const MarkdownIt = require("markdown-it");
const hljs = require("highlight.js");
const replaceDeadLinks = require("./replace_links.js");

const MD = new MarkdownIt({
  html: true,
  linkify: false,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return "";
  },
});

function splitMetaAndContent(str) {
  const result = {
    meta: "",
    content: "",
  };
  const lines = str.split(/\r?\n/);

  if (lines[0].indexOf("---") === 0) {
    let i = 1;
    while (lines[i].indexOf("---") !== 0) {
      i++;
      if (lines[i].indexOf("---") == 0) break;
    }
    result.meta = lines.slice(1, i).join("\n");
    result.content = lines.slice(i + 1).join("\n");
  } else {
    result.content = lines.join("\n");
  }
  return result;
}

const parseMd = (filePath, lang, version) => {
  const result = {
    meta: {},
    __html: "",
  };

  if (!filePath) return result;
  const extensionName = path.extname(filePath);

  if (![".md", ".markdown"].includes(extensionName)) return result;

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const splitContent = splitMetaAndContent(fileContent);
    const metas = splitContent.meta.split("\n");

    metas.forEach((meta) => {
      const metaSplit = meta.split(":");
      const key = metaSplit[0].trim();
      if (key === "") return;

      const value = metaSplit.slice(1).join(":").trim();

      result.meta[key] = value;
    });

    let content = splitContent.content;
    if (lang && version) {
      content = replaceDeadLinks(content, lang, version);
    }
    result.__html = MD.render(content);
  } catch (err) {}

  return result;
};

module.exports = parseMd;
