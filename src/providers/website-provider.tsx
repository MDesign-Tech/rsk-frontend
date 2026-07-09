"use client"

import { ReactNode } from "react";
import { useInitializeWebsite } from "@/hooks/useInitializeWebsite";
import { WebsiteLoader } from "./WebsiteLoader";

export function WebsiteProvider({
 children
}:{
 children:ReactNode
}){

 const initialized = useInitializeWebsite();


 if(!initialized){
   return <WebsiteLoader/>
 }


 return children;
}