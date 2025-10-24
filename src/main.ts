import './scss/styles.scss';
import { ProductList } from './components/models/ProductList';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { IProduct } from './types';
import { apiProducts } from './utils/data';
import { LarekApi } from './components/api/LarekApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';


const productsModel = new ProductList();

productsModel.setProducts(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getProducts());

const testProductId = apiProducts.items[0].id;
console.log("Товар по ID:", productsModel.getProductById(testProductId));

productsModel.setSelectedProduct(apiProducts.items[0]);
console.log("Выбранный товар:", productsModel.getSelectedProduct());

const basketModel = new Basket();

basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);

console.log('Товары в корзине:', basketModel.getItems());

console.log('Количество товаров в корзине:', basketModel.getItemsCount());

console.log('Итого:', basketModel.getTotalPrice());

basketModel.removeItem(apiProducts.items[0].id);
console.log('Товары в корзине после удаления:', basketModel.getItems());

basketModel.clear();
console.log("Товары в корзине после очистки:", basketModel.getItems());

const buyerModel = new Buyer();
buyerModel.setData({
  payment: 'card',
  email: 'fille_de_lave@mail.ru',
  phone: '+79999999999',
  address: ''
});

console.log("Данные покупателя:", buyerModel.getData());

console.log("Результат валидации:", buyerModel.validate());

buyerModel.clear();
console.log("Данные покупателя после очистки:", buyerModel.getData());

const api = new Api(API_URL);
const webLarek = new LarekApi(api);

webLarek.getProductList()
  .then((products: IProduct[]) => {
    productsModel.setProducts(products);
    console.log('Массив товаров из каталога: ', productsModel.getProducts());
})

.catch(error => {
    console.error("Ошибка при получении товаров:", error);
  });
