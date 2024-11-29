import { useState, useEffect } from 'react';
import ItemUtils from '../utils/ItemUtils';
import {compareVersions} from 'compare-versions';

export default function Version() {
    const [versions, setVersions] = useState({
        installed: null,
        latest: null,
        isUpdateAvailable: false
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchVersions() {
            try {
                const [installedVersion, latestVersion] = await Promise.all([
                    ItemUtils.fetchInstalledAppVersion(),
                    ItemUtils.fetchLatestAppVersion()
                ]);

                const isUpdateAvailable = installedVersion !== "dev" ? compareVersions(latestVersion, installedVersion) === 1 : false
                console.log(`[Version] isUpdateAvailable: ${isUpdateAvailable}. Currently running version ${installedVersion}, latest is ${latestVersion}`)

                setVersions({ installed: installedVersion, latest: latestVersion, isUpdateAvailable });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchVersions();
    }, []);

    if (loading) return <p>Loading version information...</p>;

    // loaded, display versions
    if (versions.isUpdateAvailable) {
        return (
            <div className="max-w-fit mx-auto select-none">
                <a href="https://github.com/azpha/subscription-tracker/releases/latest"target="_blank">
                    <p className="text-green-500 font-bold opacity-80">Version (upgrade available!): {versions.installed}</p>
                </a>
            </div>
        )
    } else {
        return (
            <div className="max-w-fit mx-auto">
                <a href={"https://github.com/azpha/subscription-tracker/releases/" + versions.installed} target="_blank">
                    <p className="font-bold opacity-50 select-none">Version: {versions.installed}</p>
                </a>
            </div>
        )
    }
}