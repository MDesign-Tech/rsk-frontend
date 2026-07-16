import api from "./api";
import type { MissionVision, ApiResponse } from "@/types";

export const missionVisionService = {

  async get() {
    const response = await api.get<ApiResponse<MissionVision>>(
      "/mission-vision"
    );

    return response.data;
  },

  async update(data: MissionVision) {
    const response = await api.put<ApiResponse<MissionVision>>(
      "/mission-vision",
      data
    );

    return response.data;
  },

  async toggleVisibility(visible: boolean) {
    const response = await api.patch<ApiResponse<MissionVision>>(
      "/mission-vision/visibility",
      { visible }
    );

    return response.data;
  }

};