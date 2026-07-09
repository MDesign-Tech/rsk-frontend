import api from "@/services/api";
import { WebsiteContent } from "@/types/index";

export const websiteService = {
  async getWebsiteContent(): Promise<WebsiteContent> {
    const res = await api.get("/website");

    return res.data.data;
  },
};