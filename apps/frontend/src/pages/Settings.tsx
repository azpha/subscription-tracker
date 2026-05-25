import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import api from "@/utils/api";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface SettingsItemProps {
  apiKey: string;
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
}

function SettingsItem({
  apiKey,
  label,
  description,
  value,
  onChange,
}: SettingsItemProps) {
  return (
    <div className="bg-secondary/50 border border-border p-2 rounded-lg">
      <Field>
        <FieldLabel className="text-lg" htmlFor={apiKey}>
          {label}
        </FieldLabel>
        <FieldDescription>{description}</FieldDescription>
        <Input
          id={apiKey}
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
        />
      </Field>
    </div>
  );
}

export default function SettingsPage() {
  const [original, setOriginal] = useState<Record<string, string>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [discordStatus, setDiscordStatus] = useState<boolean | null>(null);
  const [ntfyStatus, setNtfyStatus] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.fetchSettings().then((res) => {
      const map = Object.fromEntries(res.map((s) => [s.name, s.value]));
      setOriginal(map);
      setValues(map);
    });
  }, []);
  useEffect(() => {
    if (discordStatus || discordStatus === false) {
      setTimeout(() => {
        setDiscordStatus(null);
      }, 5000);
    }
    if (ntfyStatus || ntfyStatus === false) {
      setTimeout(() => {
        setNtfyStatus(null);
      }, 5000);
    }
  }, [discordStatus, ntfyStatus]);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const dirtyKeys = Object.keys(values).filter(
    (k) => values[k] !== (original[k] ?? ""),
  );
  const isDirty = dirtyKeys.length > 0;

  const onSave = async () => {
    if (!isDirty || saving) return;
    setSaving(true);
    try {
      const payload = dirtyKeys.map((name) => ({ name, value: values[name] }));
      await api.updateSettings(payload);
      setOriginal((prev) => ({
        ...prev,
        ...Object.fromEntries(dirtyKeys.map((k) => [k, values[k]])),
      }));
    } finally {
      setSaving(false);
    }
  };

  const getValue = (apiKey: string) => values[apiKey] ?? "";

  const onDiscordTest = async () => {
    const url = getValue("DISCORD_WEBHOOK");
    if (url) {
      const result = await api.testDiscordWebhook(url);
      setDiscordStatus(result);
    }
  };
  const onNtfyTest = async () => {
    const url = getValue("NTFY_WEBHOOK");
    if (url) {
      const result = await api.testNtfyWebhook(url);
      setNtfyStatus(result);
    }
  };

  return (
    <Layout
      headerButtons={
        <Button
          className={`bg-white text-black p-2 rounded-lg font-semibold w-full text-sm`}
          onClick={() => navigate("/")}
        >
          Go Back
        </Button>
      }
    >
      <div className="my-2">
        <div className="bg-secondary/50 border border-border p-2 rounded-lg">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your notification settings here
          </p>
          <div className="mt-4 space-y-2">
            <SettingsItem
              apiKey="DISCORD_WEBHOOK"
              label="Discord Webhook"
              description="The URL to your Discord webhook."
              value={getValue("DISCORD_WEBHOOK")}
              onChange={(v) => handleChange("DISCORD_WEBHOOK", v)}
            />
            <SettingsItem
              apiKey="NTFY_WEBHOOK"
              label="Ntfy Host"
              description="The hostname of your NTFY server."
              value={getValue("NTFY_WEBHOOK")}
              onChange={(v) => handleChange("NTFY_WEBHOOK", v)}
            />
          </div>

          <div className="my-2">
            <Button
              onClick={onSave}
              disabled={!isDirty || saving}
              className="text-lg"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>

          <hr className="my-2" />

          <h1 className="text-2xl font-bold">Test</h1>
          <p className="text-sm text-muted-foreground">
            Test your notification settings here
          </p>

          <div className="flex flex-col space-y-2 my-4">
            <div className="flex flex-row space-x-2 items-center font-bold">
              <h1>Discord</h1>
              <Button
                variant="secondary"
                className={cn(
                  discordStatus === true
                    ? "text-green-400"
                    : discordStatus === false
                      ? "text-red-400"
                      : "text-white",
                )}
                onClick={onDiscordTest}
              >
                {discordStatus === null
                  ? "Test"
                  : discordStatus
                    ? "Success"
                    : "Failed"}
              </Button>
            </div>
            <div className="flex flex-row space-x-2 items-center font-bold">
              <h1>Ntfy</h1>
              <Button
                variant="secondary"
                className={cn(
                  ntfyStatus === true
                    ? "text-green-400"
                    : ntfyStatus === false
                      ? "text-red-400"
                      : "text-white",
                )}
                onClick={onNtfyTest}
              >
                {ntfyStatus === null
                  ? "Test"
                  : ntfyStatus
                    ? "Success"
                    : "Failed"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
