const fs = require("fs-extra");

const generateBlog = require("./generate_blog");
const generateDocs = require("./generate_docs");
const generateFaq = require("./generate_faq");
const generateUser = require("./generate_user");

const BASE = process.cwd();

const generate = () => {
  fs.emptyDirSync(`${BASE}/public/pages`);
  fs.emptyDirSync(`${BASE}/public/data`);
  fs.emptyDirSync(`${BASE}/public/fetch`);
  generateBlog();
  generateDocs();
  generateUser();
  generateFaq();
};

generate();
