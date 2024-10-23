import { useEffect, useState } from "react";
import getVersions from "../api/getVersions";

export const useVersions = () => {
  const reverseVersions = (versions) => {
    let reversedVersions = versions.reverse();
    const devIndex = reversedVersions.indexOf("dev");
    if (devIndex > -1) {
      reversedVersions.splice(devIndex, 1);
      reversedVersions.push("dev");
    }
    return reversedVersions;
  };

  const stored = JSON.parse(sessionStorage.getItem("versions")) || [];
  const [versions, setVersions] = useState(reverseVersions(stored));

  useEffect(() => {
    if (!stored.length) {
      getVersions().then((result) => {
        setVersions(reverseVersions(result));
      });
    }
    // eslint-disable-next-line
  }, []);

  return { versions, currentVersion: versions[0] };
};
