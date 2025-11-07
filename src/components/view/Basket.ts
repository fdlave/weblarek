import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IBasketData {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketData> {
  protected list: HTMLElement;
  protected total: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.list = ensureElement<HTMLElement>(".basket__list", container);
    this.total = ensureElement<HTMLElement>(".basket__price", container);
    this.button = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container
    );

    this.items = [];
    this.buttonDisabled = true;

    this.button.addEventListener("click", () => {
      this.events.emit("basket:order");
    });
  }

  private createEmptyMessage(): HTMLElement {
    const emptyElement = document.createElement("p");
    emptyElement.textContent = "Корзина пуста";
    emptyElement.className = "basket__empty";
    return emptyElement;
  }

  set items(value: HTMLElement[]) {
    this.list.innerHTML = "";

    if (value.length === 0) {
      this.list.append(this.createEmptyMessage());
    } else {
      this.list.append(...value);
    }
  }

  set totalPrice(value: number) {
    this.total.textContent = `${value} синапсов`;
  }

  set buttonDisabled(value: boolean) {
    this.button.disabled = value;
  }
}
