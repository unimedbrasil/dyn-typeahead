### Dynamix Typeahead - Diretiva [AngularJS](http://angularjs.org/) que encapsula e facilita a utilização do [UI Bootstrap - Typeahead](http://angular-ui.github.io/bootstrap/#/typeahead)

### Links rápidos
- [Instalação](#instalacao)
    - [Bower](#instalar-com-o-bower)
    - [Manual](#download-manual)
- [Demo](#demo)

# Instalação

É necessário ter o [UI Bootstrap](http://angular-ui.github.io/bootstrap/) instalado com o componente de Typeahead.

*Notas:*
* Na versão version 0.1.0 o componente depende também do [dyn-domain](http://git.dynamix.com.br/angular/dyn-domains).

## Requisitos do Angular
* dyn-typeahead foi testado com o Angular 1.5.6.

## Requisitos do UI Bootstrap
* dyn-typeahead foi testado com o UI Bootstrap 1.1.2.

#### Instalar com o Bower
```sh
$ bower install dyn-typeahead=git@git.dynamix.com.br:angular/dyn-typeahead.git
```

#### Download manual

Após instalar todas as dependencias, todos os arquivos desta lib encontram-se aqui:
http://git.dynamix.com.br/angular/dyn-typeahead/tree/master/dist

### Adicionando a dependência no seu projeto

Quando você baixar todas as dependências e incluí-las no seu projeto, você poderá usá-la incluindo o módulo `dyn.typeahead`:

```js
angular.module('myModule', ['dyn.typeahead']);
```

# Demo

Uso do componente com uma URL que retorna uma lista de objetos com as propriedades `key` e `value`.

```html
<dyn-typeahead url="http://myws.com.br/unimed" ng-model="myCtrl.filter.unimed" placeholder="Pesquisa por uma Unimed"></dyn-typeahead>
```

Uso do componente integrado com o [dyn-domain](http://git.dynamix.com.br/angular/dyn-domains) e recebendo o objeto selecionado em um callback.

```html
<dyn-typeahead domain="unimed" ng-model="myCtrl.filter.unimed" on-select="myCtrl.onChangeUnimed" placeholder="Pesquisa por uma Unimed"></dyn-typeahead>
```

Quando o objeto a ser exibido possui propriedades diferentes de `key` e `value`.

```html
<dyn-typeahead domain="unimed" ng-model="myCtrl.filter.unimed" key="label" value="valor"></dyn-typeahead>
```


## Deploy
bower register dyn-typeahead {{repositorio git}}
