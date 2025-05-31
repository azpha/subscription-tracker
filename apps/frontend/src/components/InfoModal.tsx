import Version from "./Version";
import api from "../utils/api";
import { useEffect, useState } from "react";
import { NotificationConfiguration } from "../utils/types";

export default function InfoModal() {
  const [notificationStatus, setNotificationStatus] =
    useState<NotificationConfiguration>({
      discord: false,
      ntfy: false,
    });
  const [testStatus, setTestStatus] = useState<{
    type: "discord" | "ntfy" | null;
    succeeded: boolean;
    inProgress: boolean;
  }>({
    type: null,
    succeeded: false,
    inProgress: true,
  });

  useEffect(() => {
    const fetchNotificationStatus = async () => {
      const data = await api.fetchConfigStatus();
      setNotificationStatus(data);
    };

    fetchNotificationStatus();
  }, []);
  useEffect(() => {
    if (testStatus && testStatus.type) {
      setTimeout(() => {
        setTestStatus({
          type: null,
          succeeded: false,
          inProgress: true,
        });
      }, 10000);
    }
  }, [testStatus]);

  const onDiscordTest = async () => {
    setTestStatus({
      type: "discord",
      inProgress: true,
      succeeded: false,
    });

    const didSucceed = await api.testDiscordWebhook();
    if (!didSucceed) {
      setTestStatus({
        type: "discord",
        inProgress: false,
        succeeded: false,
      });
    } else {
      setTestStatus({
        type: "discord",
        inProgress: false,
        succeeded: true,
      });
    }
  };
  const onNtfyTest = async () => {
    setTestStatus({
      type: "ntfy",
      inProgress: true,
      succeeded: false,
    });

    const didSucceed = await api.testNtfyPush();
    if (!didSucceed) {
      setTestStatus({
        type: "ntfy",
        inProgress: true,
        succeeded: false,
      });
    } else {
      setTestStatus({
        type: "ntfy",
        inProgress: false,
        succeeded: true,
      });
    }
  };

  const StatusComponent = () => {
    if (testStatus.type) {
      if (!testStatus.inProgress && testStatus.succeeded) {
        return <p className="text-green-500 font-semibold">Success!</p>;
      } else if (!testStatus.inProgress && !testStatus.succeeded) {
        return <p className="text-red-500 font-semibold">Failed!</p>;
      } else if (testStatus.inProgress) {
        return <p className="text-yellow-500 font-semibold">Testing..</p>;
      }
    }
  };

  return (
    <div className="bg-zinc-800 border border-white rounded-lg p-2">
      <h1 className="text-2xl font-semibold">Subscription Tracker</h1>
      <Version />

      <div className="border-solid border-y-1 my-2 py-2">
        <h1 className="font-semibold">Discord Configured?</h1>
        {notificationStatus.discord ? (
          <>
            <p className="font-semibold text-green-500">Enabled</p>
            <div className="my-2 flex flex-wrap items-center space-x-2">
              <button
                type="button"
                onClick={onDiscordTest}
                className="text-black bg-white rounded-lg font-semibold p-1"
              >
                Test
              </button>

              {testStatus.type === "discord" && <StatusComponent />}
            </div>
          </>
        ) : (
          <p className="font-semibold text-red-500">Disabled</p>
        )}

        <h1 className="font-semibold">Ntfy Configured?</h1>
        {notificationStatus.discord ? (
          <>
            <p className="font-semibold text-green-500">Enabled</p>
            <div className="my-2 flex flex-wrap items-center space-x-2">
              <button
                type="button"
                onClick={onNtfyTest}
                className="text-black bg-white rounded-lg font-semibold p-1"
              >
                Test
              </button>

              {testStatus.type === "ntfy" && <StatusComponent />}
            </div>
          </>
        ) : (
          <p className="font-semibold text-red-500">Disabled</p>
        )}
      </div>
    </div>
  );
}
