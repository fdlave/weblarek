import { Form, IFormData } from "./Form";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { BuyerModel } from "../../models/Buyer";

interface IContactsData extends IFormData {
  email: string;
  phone: string;
}

export class FormContacts extends Form<IContactsData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents, private buyerModel: BuyerModel) {
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
    const validationErrors = this.buyerModel.validate();
  
    const formErrors: Record<string, string> = {};
    if (validationErrors.email) formErrors.email = validationErrors.email;
    if (validationErrors.phone) formErrors.phone = validationErrors.phone;

    this.errors = formErrors;
    this.valid = !formErrors.email && !formErrors.phone;
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
