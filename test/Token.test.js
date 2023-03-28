const { expect } = require("chai");

describe("ERC20Token", function () {
  let ERC20Token;
  let token;
  let owner;
  let addr1;
  let addr2;
  const NAME = "My Token";
  const SYMBOL = "MTK";
  const TOTAL_SUPPLY = 1000;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    ERC20Token = await ethers.getContractFactory("ERC20Token");
    token = await ERC20Token.deploy(NAME, SYMBOL, TOTAL_SUPPLY);
  });

  describe("Deployment", function () {
    it("Should set the correct name, symbol, and total supply", async function () {
      expect(await token.name()).to.equal(NAME);
      expect(await token.symbol()).to.equal(SYMBOL);
      expect(await token.totalSupply_()).to.equal(TOTAL_SUPPLY);
    });

    it("Should allocate the total supply to the contract owner", async function () {
      expect(await token.balanceOf(owner.address)).to.equal(TOTAL_SUPPLY);
    });
  });

  describe("Transfer", function () {
    it("Should transfer tokens between accounts", async function () {
      await token.transfer(addr1.address, 100);
      expect(await token.balanceOf(addr1.address)).to.equal(100);

      await token.connect(addr1).transfer(addr2.address, 50);
      expect(await token.balanceOf(addr2.address)).to.equal(50);
    });

    it("Should not allow transfer of more tokens than the sender has", async function () {
      await expect(token.transfer(addr1.address, 1001)).to.be.revertedWith(
        "Insufficient balance"
      );
    });
  });
  describe("mint", function () {
    it("mints new tokens and assigns them to the account", async function () {
      await token.mint(owner.address, 100);
      expect(await token.totalSupply_()).to.equal(1100);
      expect(await token.balanceOf(owner.address)).to.equal(1100);
      expect(await token.balanceOf(addr1.address)).to.equal(0);
    });

    it("reverts if the caller is not the owner", async function () {
      await expect(
        token.connect(addr1).mint(addr1.address, 100)
      ).to.be.revertedWith("You're not eligible for mint token!!");
    });
  });

  describe("Approve", function () {
    it("Should approve an address to spend tokens on behalf of the owner", async function () {
      await token.approve(addr1.address, 100);
      expect(await token.allowance(owner.address, addr1.address)).to.equal(100);
    });
    it("Should emit an Approval event", async function () {
      await expect(token.approve(addr1.address, 100))
        .to.emit(token, "Approval")
        .withArgs(owner.address, addr1.address, 100);
    });
  });

  describe("transferFrom", function () {
    beforeEach(async () => {
      await token.approve(addr1.address, 100);
    });
    it("transfers tokens from one account to another", async function () {
      await token.connect(addr1).transferFrom(owner.address, addr1.address, 50);
      expect(await token.balanceOf(owner.address)).to.equal(950);
      expect(await token.balanceOf(addr1.address)).to.equal(50);
    });
  });
});
