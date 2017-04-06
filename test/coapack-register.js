// Tests for coapack plugin register
const { expect } = require("chai");
const path = require("path");
const Register = require("../packages/coapack-register");
let register;

describe("coapack-register tests", () => {
  it("should init the object", () => {
    register = new Register();
    expect(register).to.be.an("object");
  });

  it("should test registering a plugin with just a name", (done) => {
    register.registerPlguin("chai");
    expect(register.plugins).to.have.property("chai");
    expect(register.plugins.chai).to.deep.equal({
      name: "chai",
      path: path.join(process.cwd(), "node_modules", "chai"),
      pkgJSON: require(path.join(process.cwd(), "node_modules", "chai", "package.json"))
    });
    done();
  });

  it("should test registering a plugin with a plugin object", (done) => {
    const pluginsToTest = {
      name: "chai",
      path: "node_modules/chai",
    };
    register.registerPlguin(pluginsToTest);
    expect(register.plugins).to.have.property("chai");
    expect(register.plugins.chai).to.deep.equal(pluginsToTest);
    done();
  });

  it("should check path property is added if not there", (done) => {
    const pluginsToTest = {
      name: "chai",
    };
    register.registerPlguin(pluginsToTest);
    expect(register.plugins).to.have.property("chai");
    expect(register.plugins.chai).to.have.property("path");
    done();
  });

  it("should check register errors if name is not specified", (done) => {
    expect(() => register.registerPlguin({})).to.throw("ENONAME");
    done();
  });
});
