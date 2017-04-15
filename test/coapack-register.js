// Tests for coapack plugin register
const { expect } = require("chai");
const path = require("path");
const Register = require("../packages/coapack-register");
const chaiJSON = require(path.join(process.cwd(), "node_modules", "chai", "package.json"));
let register;

describe("coapack-register tests", () => {
  describe("registerPlguin()", () => {
    it("should init the object", () => {
      register = new Register();
      expect(register).to.be.an("object");
    });

    it("should test registering a plugin with just a name", (done) => {
      register.registerPlugin("chai");
      expect(register.plugins).to.have.property("chai");
      expect(register.plugins.chai).to.have.property("name");
      expect(register.plugins.chai).to.have.property("path");
      expect(register.plugins.chai.name).to.equal("chai");
      expect(register.plugins.chai.path).to.equal(path.join(process.cwd(), "node_modules", "chai"));
      done();
    });

    it("should test registering a plugin with a plugin object", (done) => {
      const pluginsToTest = {
        name: "chai",
        path: "node_modules/chai",
      };
      register.registerPlugin(pluginsToTest);
      expect(register.plugins).to.have.property("chai");
      expect(register.plugins.chai).to.deep.equal(pluginsToTest);
      done();
    });

    it("should check path property is added if not there", (done) => {
      const pluginsToTest = {
        name: "chai",
      };
      register.registerPlugin(pluginsToTest);
      expect(register.plugins).to.have.property("chai");
      expect(register.plugins.chai).to.have.property("path");
      done();
    });

    it("should check register errors if name is not specified", (done) => {
      expect(() => register.registerPlugin({})).to.throw("ENONAME");
      done();
    });

    it("should resolve the path specified", (done) => {
      register.registerPlugin({
        name: "chai",
        path: "node_modules/chai"
      });
      expect(register.plugins.chai.path).to.equal(path.resolve("node_modules/chai"));
      done();
    });
  });
});
