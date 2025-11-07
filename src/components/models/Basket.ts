import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketModel {
  private items: IProduct[] = [];

  constructor(private events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit("basket:changed", this.items);
  }

  removeItem(productId: string): void {
    this.items = this.items.filter((item) => item.id !== productId);
    this.events.emit("basket:changed", this.items);
  }

  clear(): void {
    this.items = [];
    this.events.emit("basket:changed", this.items);
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getItemsCount(): number {
    return this.items.length;
  }

  hasItem(productId: string): boolean {
    return this.items.some((item) => item.id === productId);
  }
}
