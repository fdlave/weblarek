import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected closeButton: HTMLButtonElement;
  protected contentEl: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container
    );
    this.contentEl = ensureElement<HTMLElement>(".modal__content", container);

    this.closeButton.addEventListener("click", () => {
      this.close();
      this.events.emit("modal:close");
    });

    this.container.addEventListener("click", (evt) => {
      if (evt.target === this.container) {
        this.close();
        this.events.emit("modal:close");
      }
    });
  }

  open(): void {
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
  }

  set content(content: HTMLElement) {
    this.contentEl.innerHTML = "";
    this.contentEl.replaceChildren(content);
  }
}
