import { Component } from "../base/Component";

interface IGalleryData {
  items: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set gallery(items: HTMLElement[]) {
    this.container.innerHTML = "";
    this.container.replaceChildren(...items);
  }
}
