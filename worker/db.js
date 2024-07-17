importScripts("/dexie.js");

const db = new Dexie(this.name + "_db");

db.version(1).stores({
  blog: "++id, content, time",
  event: "++id, title, desc, time",
  faq: "++id, q, a, time",
  doc: "++id, content, version, time",
});

const getBlogData = async () => {
  try {
    const result = await fetch(`/data/blog/${this.name}.json`);
    const json = await result.json();
    db.blog.clear();
    db.blog.bulkAdd(json);
  } catch (e) {}
};

const getEventsData = async () => {
  try {
    const result = await fetch(`/data/events/${this.name}.json`);
    const json = await result.json();
    db.event.clear();
    db.event.bulkAdd(json);
  } catch (e) {}
};

const getFaqData = async () => {
  try {
    const result = await fetch(`/data/faq/${this.name}.json`);
    const json = await result.json();
    db.faq.clear();
    db.faq.bulkAdd(json);
  } catch (e) {}
};

const getDocData = async () => {
  try {
    const result = await fetch(`/data/doc/${this.name}.json`);
    const json = await result.json();
    db.doc.clear();
    db.doc.bulkAdd(json);
  } catch (e) {}
};

const getPreviousIndex = (str, index) => {
  let i = index;

  while (str[i] !== " ") {
    if (i === 0) break;
    i--;
  }
  return i;
};

const replaceStr = (str, value, limit, index) => {
  const regex = new RegExp(`(${value})`, "g");
  let slicedStr = "";
  if (str.length < limit || limit === 0) {
    slicedStr = str;
  } else if (str.length - index < limit) {
    slicedStr = str.slice(getPreviousIndex(str, str.length - limit));
  } else {
    slicedStr = str.slice(getPreviousIndex(str, index), index + limit);
  }

  return slicedStr.replace(regex, (a, b) => {
    return `<span class="matched-text">${a}</span>`;
  });
};

const initData = async () => {
  if (this.loaded) return;

  await Promise.all([
    getDocData(),
    getFaqData(),
    getEventsData(),
    getBlogData(),
  ]);
  this.loaded = true;
  this.postMessage({ loaded: true });
};

const searchEvent = async (value) => {
  const array = await db.event.orderBy("time").toArray();
  const result = [];
  for (let item of array) {
    const index = item.title.indexOf(value);
    if (index !== -1) {
      result.push({
        i: index,
        title: replaceStr(item.title, value, 100, index),
        time: new Date(item.time).getTime(),
        post: item.post,
        video_url: item.video_url,
        more: item.more,
      });
    }
  }
  return result;
};

const searchFaq = async (value) => {
  const array = await db.faq.orderBy("time").toArray();
  const result = [];
  for (let item of array) {
    const aI = item.a.indexOf(value);
    const qI = item.q.indexOf(value);
    if (aI !== -1 || qI !== -1) {
      const i =
        Math.min(aI, qI) !== -1 ? Math.min(aI, qI) : aI === -1 ? qI : aI;
      result.push({
        i,
        a: replaceStr(item.a, value, 0, aI),
        q: replaceStr(item.q, value, 0, qI),
        time: new Date(item.time).getTime(),
      });
    }
  }
  return result;
};

const searchBlog = async (value) => {
  const array = await db.blog.orderBy("time").toArray();
  const result = [];
  for (let item of array) {
    const titleI = item.content.indexOf(value);
    const contentI = item.content.indexOf(value);
    if (titleI !== -1 || contentI !== -1) {
      const i =
        Math.min(titleI, contentI) !== -1
          ? Math.min(titleI, contentI)
          : titleI === -1
          ? contentI
          : titleI;
      result.push({
        i,
        title: replaceStr(item.title, value, 100, titleI),
        desc: replaceStr(item.content, value, 300, contentI),
        time: new Date(item.time).getTime(),
        name: item.name,
      });
    }
  }
  return result;
};

const searchDoc = async (value) => {
  const array = await db.doc.orderBy("time").toArray();
  const result = [];
  for (let item of array) {
    const titleI = item.content.indexOf(value);
    const contentI = item.content.indexOf(value);
    if (titleI !== -1 || contentI !== -1) {
      const i =
        Math.min(titleI, contentI) !== -1
          ? Math.min(titleI, contentI)
          : titleI === -1
          ? contentI
          : titleI;
      result.push({
        i,
        title: replaceStr(item.title, value, 100, titleI),
        desc: replaceStr(item.content, value, 300, contentI),
        time: new Date(item.time).getTime(),
        link: item.link,
        version: item.version,
      });
    }
  }
  return result;
};

const searchData = async (value) => {
  if (db.isOpen()) {
    await db.open();
  }
  const [event = [], faq = [], blog = [], doc = []] = await Promise.all([
    searchEvent(value),
    searchFaq(value),
    searchBlog(value),
    searchDoc(value),
  ]);
  this.postMessage({
    type: "search",
    event,
    faq,
    blog,
    doc,
  });
};

const searchDocVersion = async (value, version) => {
  const array = await db.doc
    .filter((item) => item.version === version)
    .toArray();

  const result = [];
  for (let item of array) {
    const titleI = item.content.indexOf(value);
    const contentI = item.content.indexOf(value);
    if (titleI !== -1 || contentI !== -1) {
      const i =
        Math.min(titleI, contentI) !== -1
          ? Math.min(titleI, contentI)
          : titleI === -1
          ? contentI
          : titleI;
      result.push({
        i,
        title: replaceStr(item.title, value, 80, titleI),
        desc: replaceStr(item.content, value, 100, contentI),
        location: item.location,
        link: item.link,
      });
    }
  }
  this.postMessage({
    type: "search-doc",
    result,
  });
};

initData();

this.onmessage = ({ data }) => {
  if (data === "check") {
    this.postMessage({ loaded: !!this.loaded });
    return;
  }
  if (data.type === "search" && data.value) {
    searchData(data.value);
  }
  if (data.type === "search-doc" && data.value && data.version) {
    searchDocVersion(data.value, data.version);
  }
};
