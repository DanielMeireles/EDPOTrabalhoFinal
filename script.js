function TrieNo(chave) {
  this.chave = chave;
  this.pai = null;
  this.filho = {};
  this.fim = false;
}

function Trie() {
  this.root = new TrieNo(null);
}

TrieNo.prototype.getPalavra = function() {
  var saida = [];
  var no = this;
  while (no !== null) {
    saida.unshift(no.chave);
    no = no.pai;
  }
  return saida.join('');
};