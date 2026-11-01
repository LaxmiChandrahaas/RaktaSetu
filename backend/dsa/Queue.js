class QueueNode {
  constructor(data) { this.data = data; this.next = null; }
}
class Queue {
  constructor() { this.front = null; this.rear = null; }
  enqueue(data) {
    const newNode = new QueueNode(data);
    if (!this.rear) { this.front = this.rear = newNode; return; }
    this.rear.next = newNode;
    this.rear = newNode;
  }
  dequeue() {
    if (!this.front) return null;
    const temp = this.front;
    this.front = this.front.next;
    if (!this.front) this.rear = null;
    return temp.data;
  }
}
module.exports = Queue;