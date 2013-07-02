//proudly tested by Morgan Freeman
describe("underclass test suite", function(){
  it("should init autoproperties", function(){

    var Person = _.class({
      constructor: function(_name, _surname){ },
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
      constructor: function(__properties){ },
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

});
