import { IBuyerValidation, IBuyer } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerModel {
  private data: Partial<IBuyer> = {};

  constructor(private events: IEvents) {}

  setData(data: Partial<IBuyer>): void {
    this.data = { ...this.data, ...data };
    this.events.emit("buyer:changed", this.data);
  }

  getData(): Partial<IBuyer> {
    return this.data;
  }

  clear(): void {
    this.data = {};
    this.events.emit("buyer:changed", this.data);
  }

  validate(): IBuyerValidation {
    const errors: IBuyerValidation = {};

    if (!this.data.payment) {
      errors.payment = "Не выбран способ оплаты";
    }
    if (!this.data.email) {
      errors.email = "Укажите email";
    }
    if (!this.data.phone) {
      errors.phone = "Укажите телефон";
    }
    if (!this.data.address) {
      errors.address = "Укажите адрес";
    }

    return errors;
  }

  isValid(): boolean {
    return Object.keys(this.validate()).length === 0;
  }
}
