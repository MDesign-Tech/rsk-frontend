"use client";

import { useInitializeWebsite } from "@/hooks/useInitializeWebsite";
import { WebsiteLoader } from "./WebsiteLoader";


export function WebsiteInitializer(){

 useInitializeWebsite();


 return (
  <>
    <WebsiteLoader />
  </>
 );
}
