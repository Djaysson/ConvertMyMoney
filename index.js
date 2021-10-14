const express = require("express");
const app = express();
const path = require("path");

const { convert, toMoney } = require("./lib/convert");
const apiBCB = require("./lib/api-bcb");

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const cotacao = await apiBCB.getCotacao();
  res.render("home", {
    cotacao,
    type: "initial",
  });
});
app.get("/cotacao", (req, res) => {
  const { cotacao, quantidade } = req.query;
  if (cotacao && quantidade) {
    const conversao = convert(cotacao, quantidade);
    res.render("home", {
      cotacao: toMoney(cotacao),
      quantidade: toMoney(quantidade),
      conversao: toMoney(conversao),
      error: false,
      type: "result",
    });
  } else {
    res.render("cotacao", {
      error: "Valores inválidos",
    });
  }
});

app.listen(port, (err) => {
  if (err) {
    console.log("Não foi possivel iniciar");
  } else {
    console.log("ConvertMyMoney esta online");
  }
});
