export default class PriorityQueue<T> {
  private elements: [T, number][] = [];

  enqueue(element: T, priority: number) {
    this.elements.push([element, priority]);
  }
  dequeue(): T | undefined {
    let index = 0;
    for (let i = 1; i < this.elements.length; i++) {
      if (this.elements[i][1] < this.elements[index][1]) {
        index = i;
      }
    }
    return this.elements.splice(index, 1)[0]?.[0];
  }
  isEmpty() {
    return this.elements.length === 0;
  }
  display() {
    console.log(this.elements);
  }
}
