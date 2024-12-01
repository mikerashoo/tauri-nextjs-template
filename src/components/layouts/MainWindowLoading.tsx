import React, { PropsWithChildren, useEffect, useState } from 'react'
import Logo from '../common/Logo'    
import {  getVersion } from '@tauri-apps/api/app'

// import { invoke } from '@tauri-apps/api/core';

function MainWindowLoading(props?: PropsWithChildren) {

    const [verstion, setVersion] = useState<string>()
    useEffect(() => {
      getVersion().then(val => setVersion(val))
    }, [])
    
  return (
    <div className='w-screen h-screen bg-orange-400 items-center justify-center flex flex-col'>
        <Logo />

{props?.children}
        <div className='h-full items-center justify-end'>
            <h1>   {verstion}</h1>
         
        </div>
    </div>
  )
}

export default MainWindowLoading