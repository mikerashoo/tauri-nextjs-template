import Image from "next/image";
import localFont from "next/font/local";
import Link from "next/link";

import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { useEffect, useState } from "react";
import MainWindowLoading from "@/components/layouts/MainWindowLoading";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
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
        await relaunch();
      } else {
        setIsUpdating(false);
      }
    };

    setTimeout(() => {
      checkUpdate();
    }, 1000);
  }, []);
 

  if (isUpdating || isUpdated) {
    return (
      <MainWindowLoading>
        <div>
          <h1>{updateMessage}</h1>
          {updateProgress > 0 && <p>Progress {updateProgress}</p>}

          
        </div>
      </MainWindowLoading>
    );
  }
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <h1 className="text-2xl">Nextjs 14</h1>
       
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/pages/index.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link href={'page2'}
          >
          Goto Page two
          </Link>
       
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          {/* {getVers} */}
        </a>
      </footer>
    </div>
  );
}
