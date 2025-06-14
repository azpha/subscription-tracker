import Version from "../Version";
import api from "../../utils/api";
import ConfigTile from "../ConfigTile";
import Discord from "../Icons/Discord";
import Ntfy from "../Icons/Ntfy";
import { useEffect, useState } from "react";
import { NotificationConfiguration } from "../../utils/types";

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
    <div>
      <h1 className="text-2xl font-semibold">Subscription Tracker</h1>
      <Version />

      <hr className="my-2" />
      <div className="flex flex-col w-fit mx-auto">
        <div className="flex justify-start">
          <h1 className="font-semibold text-2xl mb-2">Integrations</h1>
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-2 gap-2 text-white">
            <ConfigTile
              icon={<Discord />}
              title={"Discord"}
              actionLabel={"Test"}
              action={onDiscordTest}
              actionDisabled={!notificationStatus.discord}
              message={
                testStatus.type === "discord" ? <StatusComponent /> : undefined
              }
            />
            <ConfigTile
              icon={<Ntfy />}
              title={"Ntfy"}
              actionLabel={"Test"}
              action={onNtfyTest}
              actionDisabled={!notificationStatus.ntfy}
              message={
                testStatus.type === "ntfy" ? <StatusComponent /> : undefined
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
