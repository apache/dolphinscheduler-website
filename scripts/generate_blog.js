"use strict";

const path = require("path");
const fs = require("fs-extra");
const parseMd = require("./parse_md.js");

const BASE = process.cwd();

const blogLabelJson = require(path.join(BASE, "config/blog/label.json"));
const eventsPages = {};
const blogSearchData = {
  "en-us": [],
  "zh-cn": [],
};
const eventSearchData = {
  "en-us": [],
  "zh-cn": [],
};

const getConfig = (lang) => {
  const sourcePath = path.join(BASE, "config/blog", lang);
  const configs = fs.readdirSync(sourcePath);
  const data = {};
  configs.forEach((config) => {
    const configPath = path.join(sourcePath, config);
    const fileInfo = path.parse(configPath);
    const result = fs.readFileSync(configPath);
    data[fileInfo.name] = JSON.parse(result.toString());
  });
  return data;
};

const formatBlog = (lang) => {
  const config = getConfig(lang);
  const data = {};
  const blogs = [];
  Object.entries(config).forEach(([type, subs]) => {
    const children = [];
    Object.entries(subs).forEach(([key, value]) => {
      data[key] = { ...value, type, label: blogLabelJson[lang][type] };
      children.push({ name: key, ...value });
    });
    blogs.push({
      type,
      label: blogLabelJson[lang][type],
      children,
    });
  });
  const events = formatEventsData(lang);
  blogs.push({
    type: "events",
    label: blogLabelJson[lang]["events"],
    children: events,
  });
  events.forEach((event) => {
    data[event.name] = {
      ...event,
      type: "events",
      label: blogLabelJson[lang]["events"],
    };
  });
  fs.ensureDirSync(`${BASE}/public/fetch/blog`);
  fs.writeFileSync(
    `${BASE}/public/fetch/blog/${lang}.json`,
    JSON.stringify(blogs, null, 2, "utf8")
  );

  return data;
};

const formatEventsData = (lang) => {
  const eventConfig = require(`${BASE}/config/event/${lang}.json`);
  const events = [];
  eventConfig.forEach((event) => {
    eventSearchData[lang].push({
      title: event.title,
      desc: event.title,
      time: event.startTime,
    });
    if (event.post) {
      events.push(event.post);
    }
    if (event.more) {
      eventsPages[event.more] = {
        name: event.more,
        title: event.title,
        startTime: event.startTime,
        endTime: event.endTime,
      };
    }
  });

  fs.ensureDirSync(`${BASE}/public/fetch/event`);
  fs.writeFileSync(
    `${BASE}/public/fetch/event/${lang}.json`,
    JSON.stringify(eventConfig, null, 2, "utf8")
  );
  return events;
};

const copyImg = (dir) => {
  const imgDirPath = path.join(BASE, dir, "/img");
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

const parseLog = (dir, lang, blogConfig) => {
  const blogs = fs.readdirSync(dir);
  blogs.forEach((blog) => {
    const targetPath = `${dir}/${blog}`;
    const blogStat = fs.statSync(targetPath);
    if (blogStat.isDirectory()) {
      parseLog(targetPath, lang);
      return;
    }
    const extension = path.extname(blog);
    if (blogStat.isFile() && [".md", ".markdown"].includes(extension)) {
      const fileInfo = path.parse(targetPath);
      const configInfo = blogConfig[fileInfo.name];
      const eventInfo = eventsPages[fileInfo.name];
      if (!configInfo && !eventInfo) return;
      const result = parseMd(targetPath);
      const onlyText = result["__html"].replace(/<.*?>/g, "");

      if (configInfo) {
        blogSearchData[lang].push({
          name: fileInfo.name,
          content: onlyText,
          title: configInfo.title,
          time: configInfo.dateStr,
        });
        const htmlData = {
          __html: result["__html"],
          time: configInfo.dateStr,
          author: configInfo.author,
          title: configInfo.title,
          type: configInfo.type,
          label: configInfo.label,
        };
        fs.ensureDirSync(`${BASE}/public/pages/blog/${lang}`);
        fs.writeFileSync(
          `${BASE}/public/pages/blog/${lang}/${fileInfo.name}.json`,
          JSON.stringify(htmlData, null, 2, "utf8")
        );
        return;
      }

      if (eventInfo) {
        const htmlData = {
          __html: result["__html"],
          startTime: eventInfo.startTime,
          endTime: eventInfo.endTime,
          title: eventInfo.title,
        };
        fs.ensureDirSync(`${BASE}/public/pages/events/${lang}`);
        fs.writeFileSync(
          `${BASE}/public/pages/events/${lang}/${fileInfo.name}.json`,
          JSON.stringify(htmlData, null, 2, "utf8")
        );
      }
    }
  });
  if (dir.includes("blog")) {
  }
};

const writeBlogSearchData = (type) => {
  ["en-us", "zh-cn"].forEach((lang) => {
    fs.ensureDirSync(`${BASE}/public/data/${type}`);
    fs.writeFileSync(
      `${BASE}/public/data/${type}/${lang}.json`,
      JSON.stringify(
        type === "blog" ? blogSearchData[lang] : eventSearchData[lang],
        null,
        2,
        "utf8"
      )
    );
  });
};

const generateLog = () => {
  const enBlogConfig = formatBlog("en-us");
  const zhBlogConfig = formatBlog("zh-cn");
  parseLog("blog/en-us", "en-us", enBlogConfig);
  parseLog("blog/zh-cn", "zh-cn", zhBlogConfig);
  parseLog("events/en-us", "en-us", enBlogConfig);
  parseLog("events/zh-cn", "zh-cn", zhBlogConfig);
  copyImg("events");
  copyImg("blog");
  writeBlogSearchData("blog");
  writeBlogSearchData("events");
};

module.exports = generateLog;
