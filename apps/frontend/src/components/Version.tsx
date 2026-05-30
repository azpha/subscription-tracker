import api from "../utils/api";
import { useEffect, useState } from "react";

export default function Version() {
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    const fetchVersion = async () => {
      const apiVersion = await api.fetchVersion();
      setVersion(apiVersion);
    };

    fetchVersion();
  }, []);

  return (
    <div className="text-white">
      {version && (
        <a
          href={`https://github.com/azpha/subber/releases/${version}`}
          target="_blank"
        >
          <p className="text-muted-foreground text-sm">
            Version: <span className="underline">{version || "N/A"}</span>
          </p>
        </a>
      )}
    </div>
  );
}
