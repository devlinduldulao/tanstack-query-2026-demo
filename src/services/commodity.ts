import { api } from "@/lib/axios";
import type { CommodityPaginate } from "@/models";

const endPoint = "commodities";

const commodityService = {
  async getCommodities(page: number, perPage: number): Promise<CommodityPaginate> {
    const response = await api.get<CommodityPaginate>(`${endPoint}?_page=${page}&_per_page=${perPage}`);
    return response.data;
  },
};

export default commodityService;
