"use client"

import { ReactNode } from "react";
import { useInitializeWebsite } from "@/hooks/useInitializeWebsite";
import { useWebsiteStore } from "@/stores/website.store";
import { WebsiteLoader } from "./WebsiteLoader";
import { WebsiteError } from "./WebsiteError";

export function WebsiteProvider({
  children
}:{
  children:ReactNode
}){

  const initialized = useInitializeWebsite();
  const error = useWebsiteStore((state) => state.error);

  if(!initialized){
    return <WebsiteLoader/>
  }

  if(error){
    return <WebsiteError/>;
  }

  return children;
}