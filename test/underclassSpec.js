//proudly tested by Morgan Freeman
describe("underclass test suite", function(){
  it("should init autoproperties", function(){

    var Person = _.class({
      initialize: function($name, $surname){ },
      say: function(something){
        console.log(this.name + " says : " + something);
      }
    });

    var morgan = new Person("Morgan", "Freeman");

    expect(morgan instanceof Person).toBe(true);
    expect(morgan.name).toBe("Morgan");
    expect(morgan.surname).toBe("Freeman");

  });

  it("should init object autoproperties", function(){

    var Person = _.class({
      initialize: function($$properties){ },
      say: function(something){
        console.log(this.name + " says : " + something);
      }
    });

    var morgan = new Person({
      name : "Morgan", 
      surname : "Freeman"
    });
    
    expect(morgan instanceof Person).toBe(true);
    expect(morgan.name).toBe("Morgan");
    expect(morgan.surname).toBe("Freeman");
    expect(morgan.__properties).toBe(undefined);

  });

  it("should inject 'this' if first parameter is called 'self'", function(){
    var Person = _.class({
      initialize: function($$properties){ },
      test: function(self){
        expect(self).toBe(this);
      }
    });

    var morgan = new Person({
      name : "Morgan", 
      surname : "Freeman"
    });

    morgan.test();

  });

  it("should inject 'super' if first parameter is called '_super'", function(){
    var Person = _.class({
      initialize: function($$properties){ },
      say: function(something){
        return something;
      }
    });

    var Pirate = _.class(Person, {
      initialize: function($$properties){},    
      say: function(_super, something){
        return _super(something) + " yiar!!!";
      }
    });

    var morgan = new Pirate({
      name : "Captain Morgan", 
      surname : "Freeman"
    });

    expect(morgan.say("hello")).toBe("hello yiar!!!"); 

  });

  it("should inject 'self' and 'super' if the two first parameters are called 'self' and '_super'", function(){

    var Person = _.class({
      initialize: function($$properties){ },
      say: function(something){
        return something;
      }
    });

    var Pirate = _.class(Person, {
      initialize: function($$properties){},    
      say: function(self, _super, something){
        expect(self).toBe(this);
        return _super(something) + " yiar!!!";
      }
    });

    var morgan = new Pirate({
      name : "Captain Morgan", 
      surname : "Freeman"
    });

    expect(morgan.say("hello")).toBe("hello yiar!!!"); 
  });

});
