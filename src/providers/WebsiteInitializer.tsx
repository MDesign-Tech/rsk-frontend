"use client";

import { useInitializeWebsite } from "@/hooks/useInitializeWebsite";
import { WebsiteLoader } from "./WebsiteLoader";
import { WebsiteError } from "./WebsiteError";


export function WebsiteInitializer(){

 useInitializeWebsite();


 return (
  <>
    <WebsiteLoader />
    <WebsiteError />
  </>
 );

}