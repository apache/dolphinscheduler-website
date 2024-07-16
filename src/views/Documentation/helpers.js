import { formatName } from "../../utils/formatName";

export const getChildrenByKey = (data, key) => {
  let child;
  const loop = (list) => {
    list.forEach((item) => {
      if (item.key === key) {
        child = item;
        return;
      }
      if (item.children.length) {
        loop(item.children);
      }
    });
  };
  loop(data);
  return child;
};

export const getLinkFromLocation = (location, index) => {
  if (!location || !Array.isArray(location)) return "";
  let link = "";
  location.some((item, i) => {
    if (i <= index) {
      link += "/" + formatName(item);
    }
    if (i !== location.length - 1) link += "_menu";
    return i >= index;
  });
  return link;
};

export const getSearchItemLinkFromLocation = (searchItem, index) => {
  const location = searchItem.location;
  if (!location || !Array.isArray(location)) return "";
  let link = "";
  location.some((item, i) => {
    if (i <= index) {
      link += "/" + formatName(item);
    }
    if (i !== location.length - 1) link += "_menu";
    if (i === location.length - 1) link = searchItem.link;
    return i >= index;
  });
  return link;
};
