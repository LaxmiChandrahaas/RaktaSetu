class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() { this.head = null; }
  
  insert(data) {
    const newNode = new Node(data);
    if (!this.head) { this.head = newNode; return; }
    let current = this.head;
    while (current.next) { current = current.next; }
    current.next = newNode;
  }

  toArray() {
    const arr = [];
    let current = this.head;
    while (current) { arr.push(current.data); current = current.next; }
    return arr;
  }
}
module.exports = LinkedList;