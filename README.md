Underclass: a class mixin for underscore 
========================================

Underclass is a mixin for Underscore that provides some syntactic sugar for declaring classes in JavaScript.
It borrows some ideas from CoffeeScript, Python, PrototypeJS, and Python.

So something like this:

```javascript
var Person = function (name, surname) {
    this.name = name;
    this.surname = surname;
};

Person.prototype.say = function (something) {
    alert(this.name + " " + this.surname + " says : " + something);
};

var Pirate = function (name, surname) {
    this.name = name;
    this.surname = surname;
};

Pirate.prototype = new Pirate();

Pirate.say = function(something){
    Mammal.prototype.move.apply(this, something);
    alert("... YIARR!!");
}
```

Turns into something like this:

```javascript

var Person = _.class({
    constructor: function($name, $surname){},
    says: function(){
        alert(this.name + " " + this.surname + " says : " + something);
    }
});

var Pirate = _.class({
    constructor: function($name, $surname){},
    says: function(_super, something){
        _super(something);
        alert("... YIARR!!");
    }
});
```
