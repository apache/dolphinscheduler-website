import { useEffect, useState } from "react";
import getVersions from "../api/getVersions";

export const useVersions = () => {
  const stored = JSON.parse(sessionStorage.getItem("versions")) || [];
  const [versions, setVersions] = useState(stored.reverse());

  useEffect(() => {
    if (!stored.length) {
      getVersions().then((result) => {
        setVersions(result.reverse());
      });
    }
    // eslint-disable-next-line
  }, []);

  return { versions, currentVersion: versions[0] };
};
