import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { useEffect, useState } from "react"; 
import MainWindowLoading from "@/components/layouts/MainWindowLoading";

type UpdateStatus = "checking" | "downloading" | "updating" | "done" | "no_update";

export default function App({ Component, pageProps }: AppProps) {

  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>("checking")

 
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
            setUpdateStatus("downloading")
            contentLength = event.data.contentLength as number;
            console.log(`started downloading ${event.data.contentLength} bytes`);
            break;
          case 'Progress':
            setUpdateStatus("updating")
            downloaded += event.data.chunkLength;
            console.log(`downloaded ${downloaded} from ${contentLength}`);
            break;
          case 'Finished':
            setUpdateStatus("done")
            console.log('download finished');
            break;
        }
      });
    
      console.log('update installed');
      await relaunch();
    }
    else {

      setUpdateStatus("no_update")
    }
   };

   setTimeout(() => {
   checkUpdate();
    
   }, 1000);
}, [])

const updatingGoingStatuses: UpdateStatus[] = ["checking", "downloading", "updating"]


if(updatingGoingStatuses.includes(updateStatus)){
  return <MainWindowLoading>
   <div><h1>Update Checking : {updateStatus}</h1></div>
  </MainWindowLoading>
}

  return <Component {...pageProps} />;
}
