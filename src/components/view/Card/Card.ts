import { Component } from "../../base/Component";
import { IProduct } from "../../../types/index";
import { ensureElement } from "../../../utils/utils";

export interface ICardData extends Partial<IProduct> {
  index?: number;
  id?: string;
  buttonText?: string;
  buttonDisabled?: boolean;
  description?: string;
}

export class Card<T extends ICardData> extends Component<T> {
  protected titleCard: HTMLElement;
  protected priceCard: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleCard = ensureElement<HTMLElement>(".card__title", this.container);
    this.priceCard = ensureElement<HTMLElement>(".card__price", this.container);
  }

  set title(value: string) {
    this.titleCard.textContent = value;
  }

  set price(value: number | null) {
    this.priceCard.textContent = value ? `${value} синапсов` : "Бесценно";
  }
}
