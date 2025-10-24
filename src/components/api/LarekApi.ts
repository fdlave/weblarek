import { IApi, IProduct, IOrder, IOrderResult} from '../../types';

export class LarekApi {
  constructor(private api: IApi) {}

  async getProductList(): Promise<IProduct[]> {
    const response = await this.api.get<{ items: IProduct[] }>('/product/');
    return response.items;
  }

  async createOrder(order: IOrder): Promise<IOrderResult> {
    return await this.api.post<IOrderResult>('/order', order);
  }
  
}