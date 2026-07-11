"use client";

import { usePathname } from "next/navigation";
import { useWebsiteStore } from "@/stores/website.store";


export function WebsiteError(){

 const error =
   useWebsiteStore(
    state=>state.error
   );

 const pathname = usePathname();

 // Don't show the generic website error on admin routes;
 // the admin layout handles its own error display.
 if(!error || pathname?.startsWith("/admin")) return null;


 return (

  <div className="
   min-h-screen
   flex
   items-center
   justify-center
   px-6
  ">

    <div className="text-center max-w-md">


      <h1 className="text-5xl font-bold mb-4">
        500
      </h1>


      <h2 className="text-xl font-semibold mb-3">
        Internal Server Error
      </h2>


      <p className="text-muted-foreground">
        We are unable to load this website right now.
        Please try again later.
      </p>


      <button
       onClick={()=>window.location.reload()}
       className="
        mt-6
        px-6
        py-3
        rounded-lg
        bg-primary
        text-primary-foreground
       "
      >
        Try Again
      </button>


    </div>

  </div>

 );

}