import { ICardData, Card } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { categoryMap, CDN_URL } from "../../../utils/constants";

export class PreviewCard extends Card<ICardData> {
  protected imageEl: HTMLImageElement;
  protected categoryEl: HTMLElement;
  protected buttonEl: HTMLButtonElement;
  protected descriptionEl: HTMLElement;
  private _id: string = "";

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.imageEl = ensureElement<HTMLImageElement>(".card__image", container);
    this.categoryEl = ensureElement<HTMLElement>(".card__category", container);
    this.buttonEl = ensureElement<HTMLButtonElement>(
      ".card__button",
      container
    );
    this.descriptionEl = ensureElement<HTMLElement>(".card__text", container);

    this.buttonEl.addEventListener("click", () => {
      if (this.buttonEl.textContent === "Удалить из корзины") {
        this.events.emit("basket:remove", { id: this._id });
      } else {
        this.events.emit("basket:add", { id: this._id });
      }
    });
  }

  set image(value: string) {
    this.imageEl.src = `${CDN_URL}/${value}`;
    this.imageEl.alt = this.titleCard.textContent || "";
  }

  set category(value: string) {
    this.categoryEl.textContent = value;
    this.categoryEl.className = "card__category";
    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) {
      this.categoryEl.classList.add(modifier);
    }
  }

  set buttonText(value: string) {
    this.buttonEl.textContent = value;
  }

  set description(value: string) {
    this.descriptionEl.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonEl.disabled = value;
  }

  render(data: ICardData): HTMLElement {
    this._id = data.id || "";
    return super.render(data);
  }
}
