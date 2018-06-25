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

Trie.prototype.palavraExiste = function(palavra) {
  var no = this.root;
  for(var i = 0; i < palavra.length; i++) {
    if (no.filho[palavra[i]]) {
      no = no.filho[palavra[i]];
    } else {
      return false;
    }
  }
  return no.fim;
};

Trie.prototype.busca = function(prefixo) {
  var no = this.root;
  var saida = [];
  for(var i = 0; i < prefixo.length; i++) {
    if (no.filho[prefixo[i]]) {
      no = no.filho[prefixo[i]];
    }
  }
  buscaTodasPalavras(no, saida);
  if(saida.length<maxResultados){
    return saida.sort();
  }else{
    return [];
  }
};

Trie.prototype.apagaPalavra = function(palavra) {
  if(this.palavraExiste(palavra)){
    var no = this.root;
    for(var i = 0; i < palavra.length; i++) {
      if (no.filho[palavra[i]]) {
        no = no.filho[palavra[i]];
      } else {
        return false;
      }
    }
    no.fim = "";
  }
};

function buscaTodasPalavras(no, vetor) {
  if (no.fim) {
    vetor.unshift(no.getPalavra());
  }
  for (var child in no.filho) {
    buscaTodasPalavras(no.filho[child], vetor);
  }
}

var trie = new Trie();

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  var arquivo = evt.dataTransfer.files;
  var reader = new FileReader();  
  reader.onload = function(event) {            
    document.getElementById('txtadj').value = event.target.result;
  }        
  reader.readAsText(arquivo[0],"UTF-8");
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy';
}

var dropZone = document.getElementById('txtadj');
dropZone.addEventListener('txtadj', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

var foco;
//Variável que controla o máximo de resultados que devem ser apresentados no auto preenchimento
var maxResultados = 100;

function fechaListas() {
  var x = document.getElementsByClassName("autocomplete-itens");
  for (var i = 0; i < x.length; i++) {
      x[i].parentNode.removeChild(x[i]);
  }
}

function marcaAtivo(x) {
  if (!x) return false;
  desmarcaAtivo(x);
  if (foco >= x.length) foco = 0;
  if (foco < 0) foco = (x.length - 1);
  x[foco].classList.add("autocomplete-ativo");
}

function desmarcaAtivo(x) {
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("autocomplete-ativo");
  }
}

function replaceAll(procurar, substituir, texto) {
  while(texto.indexOf(procurar) > -1){
    texto = texto.replace(procurar, substituir);
  }
  return texto;
}

document.getElementById("inserir").addEventListener("click", function (e) {
  var dicionario = document.form.txtadj.value;
  dicionario = replaceAll("\n", ';', dicionario);
  dicionario = replaceAll(" ", ';', dicionario);
  dicionario = replaceAll(".", ';', dicionario);
  dicionario = replaceAll(",", '', dicionario);
  dicionario = replaceAll(":", '', dicionario);
  dicionario = replaceAll("?", '', dicionario);
  dicionario = replaceAll("!", '', dicionario);
  dicionario = replaceAll("0", '', dicionario);
  dicionario = replaceAll("1", '', dicionario);
  dicionario = replaceAll("2", '', dicionario);
  dicionario = replaceAll("3", '', dicionario);
  dicionario = replaceAll("4", '', dicionario);
  dicionario = replaceAll("5", '', dicionario);
  dicionario = replaceAll("6", '', dicionario);
  dicionario = replaceAll("7", '', dicionario);
  dicionario = replaceAll("8", '', dicionario);
  dicionario = replaceAll("9", '', dicionario);
  dicionario = replaceAll("ª", '', dicionario);
  dicionario = replaceAll("º", '', dicionario);
  dicionario = replaceAll("(", '', dicionario);
  dicionario = replaceAll(")", '', dicionario);
  dicionario = replaceAll("-", '', dicionario);
  dicionario = dicionario.split(";");
  for(var i in dicionario){
    trie.insere(dicionario[i]);
  }
  document.getElementById("txtadj").value = "";
});

document.getElementById("texto").addEventListener("input", function (e) {
  var a, b, i, palavra, palavras, auxiliar, vetor;
  palavras = this.value.split(" ");
  for(var i in palavras){
    palavra = palavras[i];
  }
  fechaListas();
  if (!palavra) {
    return false;
  }
  var a = new Date();
  vetor = trie.busca(palavra);
  var b = new Date();
  console.log(b.getTime() - a.getTime());
  document.getElementById("tempo").value = palavra + ": " + (b.getTime() - a.getTime()) + " ms";
  foco = -1;
  a = document.createElement("div");
  a.setAttribute("id", "autocomplete-lista");
  a.setAttribute("class", "autocomplete-itens");
  this.parentNode.appendChild(a);
  if(vetor.length == 0){
    b = document.createElement("div");
    b.innerHTML = 'Para adicionar <strong>' + palavra + '</strong> ao dicionário, clique aqui ou enter';
    b.addEventListener("click", function(e) {
      trie.insere(palavra);
      fechaListas();
    });
    a.appendChild(b);
  }
  for (i = 0; i < vetor.length; i++) {
    if (vetor[i].substr(0, palavra.length).toUpperCase() == palavra.toUpperCase()) {
      b = document.createElement("div");
      b.innerHTML = "<strong>" + vetor[i].substr(0, palavra.length) + "</strong>";
      b.innerHTML += vetor[i].substr(palavra.length);
      b.innerHTML += "<input type='hidden' value='" + vetor[i] + "'>";
      b.addEventListener("click", function(e) {
        palavras[palavras.length-1] = this.getElementsByTagName("input")[0].value;
        auxiliar = "";
        for(var i in palavras){
          auxiliar = auxiliar + palavras[i] + " ";
        }
        document.getElementById("texto").value = auxiliar;
        fechaListas();
      });
      a.appendChild(b);
      if(trie.palavraExiste(palavra) && palavra == vetor[i]){
        c = document.createElement("div");
        c.innerHTML = "<strong>Excluir "+vetor[i]+ "</strong>";
        c.addEventListener("click", function(e) {
          trie.apagaPalavra(palavra);
          fechaListas();
        });
        b.appendChild(c);
      }
    }
  }
  if(!trie.palavraExiste(palavra) && vetor.length > 0){
    c = document.createElement("div");
    c.innerHTML = 'Para adicionar <strong>' + palavra + '</strong> ao dicionário, clique aqui';
    c.addEventListener("click", function(e) {
      trie.insere(palavra);
      fechaListas();
    });
    a.appendChild(c);
  }
});