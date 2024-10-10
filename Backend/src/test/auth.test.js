import chai from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";

const { expect } = chai;
chai.use(chaiHttp);

// before(async () => {

//   setTimeout(() => {
//     console.log("DB connection established");
//   }, 60000);
// });

describe("Testing user authentication", () => {
  it("POST /auth/signup", (done) => {
    chai
      .request(app)
      .post("/api/auth/signup")
      .send({
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("status").that.equals("success");
        expect(res.body).to.have.property("user").that.is.an("object");
        done();
      });
  });

  it("POST /auth/login", (done) => {
    chai
      .request(app)
      .post("/api/auth/login")
      .send({ email: "john.doe@example.com", password: "password123" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("status").that.is.a("success");
        expect(res.body).to.have.property("user").that.is.an("object");
        done();
      });
  });

  it("POST /auth/login with wrong details", (done) => {
    chai
      .request(app)
      .post("/api/auth/login")
      .send({ email: "wrong.email@example.com", password: "wrongpassword" })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("status").that.equals("error");
        done();
      });
  });

  
  it("GET /auth/check-auth", (done) => {
    chai
    .request(app)
    .get("/api/auth/check-auth")
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("status").that.equals("success");
      expect(res.body).to.have.property("user").that.is.an("object");
      done();
    });
  });
  
  it("POST /auth/logout", (done) => {
    chai
      .request(app)
      .post("/api/auth/logout")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it("POST /auth/forget-password", (done) => {
    chai
      .request(app)
      .post("/api/auth/forget-password")
      .send({ email: "john.doe@example.com" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
