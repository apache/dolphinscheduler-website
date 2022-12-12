import { useState, useEffect } from "react";
import { getUser } from "../../api/getUser";
import { getBlogs } from "../../api/getBlogs";

export const useCase = (locale) => {
  const [users, setUsers] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleData = async () => {
    const result = await getUser(locale);
    setUsers(result.map((item) => `/user/${locale}/${item}`));
    const casesResult = await getBlogs(locale);
    casesResult.some((item) => {
      if (item.type === "user") {
        setCases(item.children);
        return true;
      }
      return false;
    });
    setLoading(false);
  };

  useEffect(() => {
    handleData();
    // eslint-disable-next-line
  }, []);

  return { users, cases, loading };
};
