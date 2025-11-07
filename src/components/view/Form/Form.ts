import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export interface IFormData {
  error?: string;
}

export abstract class Form<T> extends Component<T & IFormData> {
  protected submitButton: HTMLButtonElement;
  protected error: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container
    );
    this.error = ensureElement<HTMLElement>(".form__errors", container);
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: Record<string, string>) {
    const errorText = Object.values(value).filter(Boolean).join(", ");
    this.error.textContent = errorText;
  }
}
