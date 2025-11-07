import { Form, IFormData } from "./Form";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { TPayment } from "../../../types";

interface IOrderData extends IFormData {
  payment: TPayment;
  address: string;
}

export class FormOrder extends Form<IOrderData> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);

    this.cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      container
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      container
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container
    );

    this.cardButton.addEventListener("click", () => {
      this.events.emit("payment:changed", { payment: "card" });
    });

    this.cashButton.addEventListener("click", () => {
      this.events.emit("payment:changed", { payment: "cash" });
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit("address:changed", { address: this.addressInput.value });
      this.validateForm();
    });

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("form:order:submit");
    });
  }

  set payment(value: TPayment) {
    this.toggleButtonActive(this.cardButton, value === "card");
    this.toggleButtonActive(this.cashButton, value === "cash");
    this.validateForm();
  }

  set address(value: string) {
    this.addressInput.value = value;
    this.validateForm();
  }

  private validateForm(): void {
    const hasPayment =
      this.cardButton.classList.contains("button_alt-active") ||
      this.cashButton.classList.contains("button_alt-active");
    const hasAddress = this.addressInput.value.trim() !== "";

    const errors: Record<string, string> = {};
    if (!hasPayment) errors.payment = "Выберите способ оплаты";
    if (!hasAddress) errors.address = "Необходимо указать адрес";

    this.errors = errors;
    this.valid = hasPayment && hasAddress;
  }

  private toggleButtonActive(button: HTMLButtonElement, isActive: boolean) {
    button.classList.toggle("button_alt-active", isActive);
  }
}
