import { useState, useEffect } from "react";

export const useHome = () => {
  const [star, setStar] = useState(0);
  const [fork, setFork] = useState(0);

  useEffect(() => {
    fetch("https://api.github.com/repos/apache/dolphinscheduler")
      .then((res) => res.json())
      .then((data) => {
        setStar(data.stargazers_count);
        setFork(data.forks_count);
      });
  }, []);

  return { star, fork };
};
