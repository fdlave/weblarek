import { ICardData, Card } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export class CardBasket extends Card<ICardData> {
  protected index: HTMLElement;
  protected button: HTMLButtonElement;
  private _id: string = "";

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.index = ensureElement<HTMLElement>(".basket__item-index", container);
    this.button = ensureElement<HTMLButtonElement>(".basket__item-delete", container);

    this.button.addEventListener("click", () => {
      this.events.emit("basket:remove", { id: this._id });
    });
  }

  set indexNum(value: number) {
    this.index.textContent = value.toString();
  }

  render(data: ICardData) {
    this._id = data.id || "";

    if (data.index !== undefined) {
      this.indexNum = data.index;
    }
    return super.render(data);
  }
}
