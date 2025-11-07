import { ICardData, Card } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { categoryMap, CDN_URL } from "../../../utils/constants";

export class CardCatalog extends Card<ICardData> {
  protected imageEl: HTMLImageElement;
  protected categoryEl: HTMLElement;
  private _id: string = "";

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.imageEl = ensureElement<HTMLImageElement>(".card__image", container);
    this.categoryEl = ensureElement<HTMLElement>(".card__category", container);

    this.container.addEventListener("click", () => {
      this.events.emit("product:select", { id: this._id });
    });
  }

  set image(value: string) {
    this.imageEl.src = `${CDN_URL}/${value}`;
    this.imageEl.alt = this.titleCard.textContent;
  }

  set category(value: string) {
    this.categoryEl.textContent = value;
    this.categoryEl.className = "card__category";
    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) {
      this.categoryEl.classList.add(modifier);
    }
  }

  render(data: ICardData): HTMLElement {
    this._id = data.id || "";
    return super.render(data);
  }
}
