import { useState, useEffect } from 'react';
import ItemUtils from '../utils/ItemUtils';
import {compareVersions} from 'compare-versions';

export default function Version() {
    const [versions, setVersions] = useState({
        installed: null,
        latest: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchVersions() {
            try {
                const [installedVersion, latestVersion] = await Promise.all([
                    ItemUtils.fetchInstalledAppVersion(),
                    ItemUtils.fetchLatestAppVersion()
                ]);
                setVersions({ installed: installedVersion, latest: latestVersion });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchVersions();
    }, []);
    useEffect(() => {
        if (versions.installed && versions.latest) {
            console.table({versions})
        }
    }, [versions])

    if (loading) return <p>Loading version information...</p>;
    if (versions.installed && versions.latest) {
        if (versions.installed !== "dev" && compareVersions(versions.latest, versions.installed) === 1) {
            return (
                <div className="max-w-fit mx-auto">
                    <a href="https://github.com/azpha/subscription-tracker/releases/latest"target="_blank">
                        <p className="text-green-500 font-bold opacity-80">Version (upgrade available!): {versions.installed}</p>
                    </a>
                </div>
            )
        } else {
            return (
                <div className="max-w-fit mx-auto">
                    <a href={"https://github.com/azpha/subscription-tracker/releases/" + versions.installed} target="_blank">
                        <p className="font-bold opacity-50">Version: {versions.installed}</p>
                    </a>
                </div>
            )
        }
    }
}