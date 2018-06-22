function TrieNo(chave) {
  this.chave = chave;
  this.pai = null;
  this.filho = {};
  this.fim = false;
}

function Trie() {
  this.root = new TrieNo(null);
}