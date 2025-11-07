import { Form, IFormData } from "./Form";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

interface IContactsData extends IFormData {
  email: string;
  phone: string;
}

export class FormContacts extends Form<IContactsData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container
    );

    this.emailInput.addEventListener("input", () => {
      this.events.emit("form:email:changed", { email: this.emailInput.value });
      this.validateForm();
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit("form:phone:changed", { phone: this.phoneInput.value });
      this.validateForm();
    });

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("contacts:submit");
    });
  }

  private validateForm(): void {
    const hasEmail = this.emailInput.value.trim() !== "";
    const hasPhone = this.phoneInput.value.trim() !== "";

    const errors: Record<string, string> = {};
    if (!hasEmail) errors.email = "Введите email";
    if (!hasPhone) errors.phone = "Введите телефон";

    this.errors = errors;
    this.valid = hasEmail && hasPhone;
  }

  set email(value: string) {
    this.emailInput.value = value;
    this.validateForm();
  }

  set phone(value: string) {
    this.phoneInput.value = value;
    this.validateForm();
  }
}
