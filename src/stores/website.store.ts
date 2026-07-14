import { create } from "zustand";
import { websiteService } from "@/services/website.service";
import type { WebsiteContent } from "@/types";


interface WebsiteStore {

  data: WebsiteContent | null;

  loading: boolean;

  initialized: boolean;

  error: string | null;

  fetchWebsite: () => Promise<void>;

}


export const useWebsiteStore = create<WebsiteStore>((set)=>({

  data:null,

  loading:false,

  initialized:false,

  error:null,


  fetchWebsite: async()=>{

    set({
      loading:true,
      error:null
    });


    try{

      const data =
        await websiteService.getWebsiteContent();


      set({

        data,

        initialized:true,

      });


    }catch(error:any){

      // Continue with app even if backend is unavailable
      console.log("[v0] Backend unavailable, initializing without data:", error.message);

      set({

        initialized:true,
        error: null

      });


    }finally{

      set({
        loading:false
      });

    }

  }

}));
