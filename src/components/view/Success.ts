import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface ISuccessData {
  total: number;
}

export class Success extends Component<ISuccessData> {
  protected button: HTMLButtonElement;
  protected descriptionEl: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.button = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      container
    );
    this.descriptionEl = ensureElement<HTMLElement>(
      ".order-success__description",
      container
    );

    this.button.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  set total(value: number) {
    this.descriptionEl.textContent = `Списано ${value} синапсов`;
  }
}
