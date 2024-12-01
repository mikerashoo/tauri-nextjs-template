import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { useEffect, useState } from "react";
import MainWindowLoading from "@/components/layouts/MainWindowLoading";

export default function App({ Component, pageProps }: AppProps) {
  const [updateMessage, setUpdateMessage] = useState<string>(
    "checking For Update"
  );
  const [isUpdating, setIsUpdating] = useState<boolean>(true);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [updateProgress, setUpdateProgress] = useState<number>(0);

  useEffect(() => {
    const checkUpdate = async () => {
      const update = await check();
      console.log("update", update);

      if (update) {
        console.log(
          `found update ${update.version} from ${update.date} with notes ${update.body}`
        );
        setUpdateMessage(
          `found update ${update.version} from ${update.date} with notes ${update.body}`
        );
        let downloaded = 0;
        let contentLength = 0;
        // alternatively we could also call update.download() and update.install() separately
        await update.downloadAndInstall((event) => {
          switch (event.event) {
            case "Started":
              contentLength = event.data.contentLength as number;
              setUpdateMessage(
                `started downloading ${event.data.contentLength} bytes`
              );
              break;
            case "Progress":
              downloaded += event.data.chunkLength;
              setUpdateMessage(
                `downloaded ${downloaded} from ${contentLength}`
              );
              setUpdateProgress((downloaded / contentLength) * 100);
              break;
            case "Finished":
              setUpdateProgress(100);
              setUpdateMessage("download finished");
              break;
          }
        });

        console.log("update installed");
        setIsUpdated(true);
      } else {
        setIsUpdating(false);
      }
    };

    setTimeout(() => {
      checkUpdate();
    }, 1000);
  }, []);

  const restartRequest = async () => await relaunch();

  if (isUpdating || isUpdated) {
    return (
      <MainWindowLoading>
        <div>
          <h1>{updateMessage}</h1>
          {updateProgress > 0 && <p>Progress {updateProgress}</p>}

          {isUpdated && (
            <button onClick={restartRequest}>Restart Application</button>
          )}
        </div>
      </MainWindowLoading>
    );
  }

  return <Component {...pageProps} />;
}
