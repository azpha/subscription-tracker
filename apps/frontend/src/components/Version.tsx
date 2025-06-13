import api from "../utils/api";
import { useEffect, useState } from "react";

export default function Version() {
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    const fetchVersion = async () => {
      const apiVersion = await api.fetchVersion();
      console.log(apiVersion);

      setVersion(apiVersion);
    };

    fetchVersion();
  }, []);

  return (
    <div>
      {version && (
        <a
          href={`https://github.com/azpha/subscription-tracker/releases/${version}`}
          target="_blank"
        >
          <p>Version: {version}</p>
        </a>
      )}
    </div>
  );
}
