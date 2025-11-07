import "./scss/styles.scss";
import { ProductsModel } from "./components/models/ProductList";
import { BasketModel } from "./components/models/Basket";
import { BuyerModel } from "./components/models/Buyer";
import { IProduct, IOrder } from "./types";
import { LarekApi } from "./components/api/LarekApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";
import { ensureElement, cloneTemplate } from "./utils/utils";

import { CardCatalog } from "./components/view/Card/CardCatalog";
import { PreviewCard } from "./components/view/Card/CardPreview";
import { CardBasket } from "./components/view/Card/CardBasket";
import { Gallery } from "./components/view/Gallery";
import { Basket } from "./components/view/Basket";
import { Header } from "./components/view/Header";
import { FormOrder } from "./components/view/Form/FormOrder";
import { FormContacts } from "./components/view/Form/FormContacts";
import { Modal } from "./components/view/Modal";
import { Success } from "./components/view/Success";

const events = new EventEmitter();
const api = new Api(API_URL);
const webLarek = new LarekApi(api);

const productsModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const modalContainer = ensureElement<HTMLElement>("#modal-container");
const galleryContainer = ensureElement<HTMLElement>(".gallery");
const headerContainer = ensureElement<HTMLElement>(".header");

//шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer, events);
const header = new Header(headerContainer, events);

const basketElement = cloneTemplate<HTMLElement>(basketTemplate);
const basketView = new Basket(basketElement, events);

const orderElement = cloneTemplate<HTMLElement>(orderTemplate);
const orderForm = new FormOrder(orderElement, events);

const contactsElement = cloneTemplate<HTMLElement>(contactsTemplate);
const contactsForm = new FormContacts(contactsElement, events);

const successElement = cloneTemplate<HTMLElement>(successTemplate);
const successView = new Success(successElement, events);

webLarek
  .getProductList()
  .then((products: IProduct[]) => {
    productsModel.setProducts(products);
    console.log(productsModel.getProducts());
  })
  .catch((err: unknown) => {
    console.error("Не удалось загрузить товары: ", err);
  });

// каталог
events.on("products:changed", () => {
  const products = productsModel.getProducts();
  console.log("Рендерим товары:", products);

  const cards = products.map((product) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);
    return card.render({ ...product, id: product.id });
  });

  gallery.gallery = cards;
});

events.on("product:select", (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (product) {
    productsModel.setSelectedProduct(product);

    const previewElement = cloneTemplate<HTMLElement>(cardPreviewTemplate);
    const previewCard = new PreviewCard(previewElement, events);

    const inBasket = basketModel.hasItem(product.id);
    let buttonText = "В корзину";
    let buttonDisabled = false;

    if (product.price === null) {
      buttonText = "Недоступно";
      buttonDisabled = true;
    } else if (inBasket) {
      buttonText = "Удалить из корзины";
    }

    previewCard.render({
      ...product,
      buttonText,
      buttonDisabled,
    });

    modal.content = previewElement;
    modal.open();
  }
});

//корзина
events.on("basket:open", () => {
  const items = basketModel.getItems();
  basketView.buttonDisabled = items.length === 0;
  modal.content = basketView.render();
  modal.open();
});

events.on("basket:add", (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (product) {
    basketModel.addItem(product);
    document.querySelector(".card__button")!.textContent = "Удалить из корзины";
  }
});

events.on("basket:order", () => {
  modal.content = orderForm.render({ payment: undefined, address: "" });
  modal.open();
});

events.on("basket:changed", () => {
  const items = basketModel.getItems();
  header.counter = items.length;

  basketView.items = items.map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), events);
    return card.render({ ...item, index: index + 1 });
  });

  basketView.totalPrice = basketModel.getTotalPrice();
  basketView.buttonDisabled = items.length === 0;
});

events.on("basket:remove", (data: { id: string }) => {
  basketModel.removeItem(data.id);
});

events.on("payment:changed", (data: { payment: "card" | "cash" }) => {
  buyerModel.setData({ payment: data.payment });
  orderForm.payment = data.payment;
});

events.on("address:changed", (data: { address: string }) => {
  buyerModel.setData({ address: data.address });
});

//покупатель и форма
events.on("form:order:submit", () => {
  modal.content = contactsForm.render({});
  modal.open();
});

events.on("form:email:changed", (data: { email: string }) => {
  buyerModel.setData({ email: data.email });
});

events.on("form:phone:changed", (data: { phone: string }) => {
  buyerModel.setData({ phone: data.phone });
});

events.on("contacts:submit", () => {
  const buyerData = buyerModel.getData();
  const order: IOrder = {
    payment: buyerData.payment!,
    email: buyerData.email!,
    phone: buyerData.phone!,
    address: buyerData.address!,
    total: basketModel.getTotalPrice(),
    items: basketModel.getItems().map((item) => item.id),
  };

  webLarek
    .createOrder(order)
    .then((result) => {
      successView.total = result.total;
      modal.content = successView.render();

      basketModel.clear();
      header.counter = 0;
    })
    .catch((error) => {
      console.error("Ошибка при оформлении заказа:", error);
    });
});
events.on("success:close", () => {
  modal.close();
});

events.on("modal:close", () => {
  modal.close();
});

webLarek
  .getProductList()
  .then((products: IProduct[]) => {
    productsModel.setProducts(products);
    console.log("Массив товаров из каталога: ", productsModel.getProducts());
  })

  .catch((error) => {
    console.error("Ошибка при получении товаров:", error);
});
