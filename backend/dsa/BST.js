class BSTNode {
  constructor(data) { this.data = data; this.left = null; this.right = null; }
}
class BST {
  constructor() { this.root = null; }
  insert(data) {
    const newNode = new BSTNode(data);
    if (!this.root) { this.root = newNode; return; }
    let current = this.root;
    while (true) {
      if (data.id < current.data.id) {
        if (!current.left) { current.left = newNode; return; }
        current = current.left;
      } else {
        if (!current.right) { current.right = newNode; return; }
        current = current.right;
      }
    }
  }
  search(id) {
    let current = this.root;
    while (current) {
      if (id === current.data.id) return current.data;
      if (id < current.data.id) current = current.left;
      else current = current.right;
    }
    return null;
  }
}
module.exports = BST;