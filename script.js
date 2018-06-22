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

Trie.prototype.insere = function(palavra) {
  var no = this.root;
  for(var i = 0; i < palavra.length; i++) {
    if (!no.filho[palavra[i]]) {
      no.filho[palavra[i]] = new TrieNo(palavra[i]);
      no.filho[palavra[i]].pai = no;
    }
    no = no.filho[palavra[i]];
    if (i == palavra.length-1) {
      no.fim = true;
    }
  }
  var auxiliar = palavra[0].toUpperCase() + palavra.slice(1);
  if(auxiliar != palavra){
    trie.insere(auxiliar);
  }
};