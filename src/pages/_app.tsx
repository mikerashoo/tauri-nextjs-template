import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {

 
useEffect(() => {
 
   const checkUpdate = async () => {
    
    const update =await check()
    console.log("update", update)

    if (update) {
      console.log(
        `found update ${update.version} from ${update.date} with notes ${update.body}`
      );
      let downloaded = 0;
      let contentLength = 0;
      // alternatively we could also call update.download() and update.install() separately
      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started':
            contentLength = event.data.contentLength as number;
            console.log(`started downloading ${event.data.contentLength} bytes`);
            break;
          case 'Progress':
            downloaded += event.data.chunkLength;
            console.log(`downloaded ${downloaded} from ${contentLength}`);
            break;
          case 'Finished':
            console.log('download finished');
            break;
        }
      });
    
      console.log('update installed');
      await relaunch();
    }
   };
   checkUpdate();
}, [])


  return <Component {...pageProps} />;
}
