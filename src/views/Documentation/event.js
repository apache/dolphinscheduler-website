class DocEvent {
  constructor() {
    this.el = document.createElement("div");
  }
  dispatch(name, detail) {
    const event = new CustomEvent(name, { detail });
    this.el.dispatchEvent(event);
  }
  on(name, callback) {
    this.el.addEventListener(name, callback);
  }
}
export default new DocEvent();
