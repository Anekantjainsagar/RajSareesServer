const order = require("express").Router();

const Order = require("../../model/orderSchema");
const Payments = require("../../model/paymentSchema");
const Login = require("../../model/loginSchema");

const sdk = require("api")("@cashfreedocs-new/v3#3oi9ke2mljzm0bo0");

order.post("/place", async (req, res) => {
  //   sdk.server("https://api.cashfree.com/pg");
  sdk.server("https://sandbox.cashfree.com/pg");

  let { user_id, products, amount } = req.body;

  const user = await Login.findById(user_id);
  const order = new Order({
    user_id,
    products,
    amount: parseInt(amount),
  });

  order
    .save()
    .then((resp) => {
      sdk
        .createOrder(
          {
            order_id: order?._id,
            order_amount: amount ? parseInt(amount) : 0,
            order_currency: "INR",
            customer_details: {
              customer_id: Date.now().toString().slice(0, 40),
              customer_name: user?.name,
              customer_email: user?.email,
              customer_phone: user?.phone.toString(),
            },
            order_meta: {
              return_url: `https://rajsareesenterprises.com/pay/{order_id}`,
              // return_url: `http://localhost:3000/pay/{order_id}`,
            },
          },
          {
            "x-client-id": process.env.APP_ID,
            "x-client-secret": process.env.SECRET,
            "x-api-version": "2022-09-01",
          }
        )
        .then(({ data }) => {
          res.status(200).send({ ...data, order: order?._id });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send(err.message);
        });
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

order.post("/payment", async (req, res) => {
  const { order_id, amount } = req.body;
  const pay = await Payments.findOne({ order_id });
  const order = await Order.findById(order_id);

  if (pay) {
    res.status(201).send("Invalid uri");
  } else {
    try {
      // await fetch(`https://api.cashfree.com/pg/orders/${order_id}`, {
      await fetch(`https://sandbox.cashfree.com/pg/orders/${order_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2022-09-01",
          "x-client-id": process.env.APP_ID,
          "x-client-secret": process.env.SECRET,
        },
      })
        .then((res) => res.json())
        .then((response) => {
          if (response?.order_status === "PAID") {
            const payment = new Payments({
              amount: amount,
              order_id,
              user_id: order?.user_id,
            });
            payment
              .save()
              .then(async (response) => {
                const update = await Order.updateOne(
                  { _id: order_id },
                  { status: "NewOrder", payment_id: payment?._id }
                );
                res.status(200).send("This order is paid!");
              })
              .catch((err) => {
                res.status(500).send("Internal Server Error");
              });
          } else {
            res.status(203).send("Order has not been paid!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      res.status(500).send("Internal Server Error");
    }
  }
});

order.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findOne({ _id: id });
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = order;
