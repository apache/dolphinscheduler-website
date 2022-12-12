import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { getBlogs } from "../../api/getBlogs";

export const useBlog = (locale) => {
  const [blogs, setBlogs] = useState([]);
  const [categorys, setCategorys] = useState([
    { label: "By Category", children: [] },
    { label: "By Time", children: [] },
  ]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState([]);
  const cachedBlogs = useRef([]);

  const handleBlogs = async () => {
    if (loading) return;
    setLoading(true);
    const result = await getBlogs(locale);
    let _blogs = [];
    const _categorys = [
      { label: "By Category", children: [] },
      { label: "By Time", children: [] },
    ];
    const _time = new Set();
    result.forEach((item) => {
      _categorys[0].children.push({
        label: item.label,
        value: item.type,
      });
      if (item.children) {
        item.children.forEach((slip) => {
          const temp = { ...slip, type: item.type, typeLabel: item.label };
          if (dayjs(slip.dateStr).isValid()) {
            _time.add(dayjs(slip.dateStr).year());
            temp.year = dayjs(slip.dateStr).year();
          }
          _blogs.push(temp);
        });
      }
    });
    _time.forEach((time) => {
      _categorys[1].children.push({ label: time, value: time });
    });
    _blogs = _blogs.sort(
      (a, b) => dayjs(b.dateStr).valueOf() - dayjs(a.dateStr).valueOf()
    );
    setBlogs(_blogs);
    setCategorys(_categorys);
    cachedBlogs.current = _blogs;
    setLoading(false);
  };

  const filterBlogs = (value) => {
    const years = value.filter((item) => Number(item) === item);
    setBlogs(
      cachedBlogs.current.filter((blog) => {
        if (value.length === 0) return true;
        return (
          value.includes(blog.type) &&
          (!years.length || value.includes(blog.year))
        );
      })
    );
  };

  const onCheckboxChange = (e, value) => {
    const list = checked.slice();
    if (e.target.checked) {
      list.push(value);
    } else {
      const i = list.indexOf(value);
      list.splice(i, 1);
    }
    setChecked(list);
    filterBlogs(list);
  };

  const onClear = () => {
    setChecked([]);
    setBlogs(cachedBlogs.current);
  };

  useEffect(() => {
    handleBlogs();
    // eslint-disable-next-line
  }, []);

  return {
    blogs,
    categorys,
    loading,
    checked,
    onCheckboxChange,
    onClear,
  };
};
