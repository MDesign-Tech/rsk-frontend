import { create } from "zustand";
import type { Opportunity } from "@/types";
import type { OpportunityInput } from "@/schemas";
import { opportunityService } from "@/services/opportunity";

interface OpportunityStore {
  opportunities: Opportunity[];
  loading: boolean;
  fetchOpportunities: () => Promise<void>;
  addOpportunity: (data: OpportunityInput, image?: File) => Promise<void>;
  updateOpportunity: (id: string, data: OpportunityInput, image?: File) => Promise<void>;
  removeOpportunity: (id: string) => Promise<void>;
  toggleVisibility: (id: string) => Promise<void>;
}

export const useOpportunityStore = create<OpportunityStore>((set, get) => ({
  opportunities: [],
  loading: false,

  fetchOpportunities: async () => {
    set({ loading: true });
    try {
      const response = await opportunityService.listAdmin();
      set({ opportunities: response.opportunities, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  addOpportunity: async (data: OpportunityInput, image?: File) => {
    const { image: _image, ...rest } = data as OpportunityInput & { image?: string };
    const newOpportunity = await opportunityService.create(rest, image);
    set((state) => ({
      opportunities: [newOpportunity, ...state.opportunities],
    }));
  },

  updateOpportunity: async (id: string, data: OpportunityInput, image?: File) => {
    const { image: _image, ...rest } = data as OpportunityInput & { image?: string };
    const updated = await opportunityService.update(id, rest, image);
    set((state) => ({
      opportunities: state.opportunities.map((o) =>
        o._id === id || o.id === id ? updated : o
      ),
    }));
  },

  removeOpportunity: async (id: string) => {
    await opportunityService.remove(id);
    set((state) => ({
      opportunities: state.opportunities.filter(
        (o) => o._id !== id && o.id !== id
      ),
    }));
  },

  toggleVisibility: async (id: string) => {
    const opportunity = await opportunityService.toggleStatus(id, "active");
    set((state) => ({
      opportunities: state.opportunities.map((o) =>
        o._id === id || o.id === id ? opportunity : o
      ),
    }));
  },
}));
