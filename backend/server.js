const express = require("express");
// const app = express();
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const cors = require("cors");
const cloudinary = require("./cloudinary");
const paypal = require("@paypal/checkout-server-sdk");
const { server, app } = require("./socket/socket");
app.use(
  cors({
    origin: [
      "https://bite-box-three.vercel.app",
      "https://bitebox-web.onrender.com",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const authRoute = require("./routes/auth/authRoute");
const restaurantRoute = require("./routes/restaurants/restaurant");
const cartRoute = require("./routes/Cart/cartRoute");
const addressRoute = require("./routes/Address/addressRoute");
const orderRoute = require("./routes/Order/orderRoute");
const reviews = require("./routes/reviews/reviews");
const contactRoute = require("./routes/contact/contactRoute");
const pool = require("./db");

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

app.get("/api/health", (req, res) => {
  res.status(200).send("OK");
});

function getPayPalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  // For sandbox environment
  const environment = new paypal.core.SandboxEnvironment(
    clientId,
    clientSecret
  );
  // For production:
  // const environment = new paypal.core.LiveEnvironment(clientId, clientSecret);

  return new paypal.core.PayPalHttpClient(environment);
}

// API route to create a PayPal order
app.post("/api/create-paypal-order", async (req, res) => {
  try {
    const { IDs, orderData, amount, taxAmount } = req.body;
    console.log(orderData);
    // console.log(amount, "amount");
    // console.log(taxAmount, "taxAmount");
    console.log(IDs);
    const { userID, restaurantID, addressID, cartID } = IDs;
    const overallTotal = (amount + taxAmount).toFixed(2);

    if (!orderData) {
      return res.status(400).json({ message: "Order items are required" });
    }
    // Create a request object
    const request = new paypal.orders.OrdersCreateRequest();

    // Set request headers
    request.headers["prefer"] = "return=representation";

    // Item details for PayPal
    const itemsList = orderData.map((item) => {
      return {
        name: item.name,
        unit_amount: {
          currency_code: "USD",
          value: item.price.toString(),
        },
        quantity: item.quantity.toString(),
      };
    });

    console.log(`Using APP_URL for PayPal return_url: ${process.env.APP_URL}`);

    // Configure the order request
    request.requestBody({
      intent: "CAPTURE",
      application_context: {
        return_url: `${process.env.APP_URL}/payment-success`,
        cancel_url: `${process.env.APP_URL}/payment-canceled`,
        brand_name: "BiteBox",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: overallTotal,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: amount.toFixed(2),
              },
              tax_total: {
                currency_code: "USD",
                value: taxAmount.toFixed(2),
              },
            },
          },
          items: itemsList,
        },
      ],
    });

    // Execute the request to create the order
    const paypalClient = getPayPalClient();
    const order = await paypalClient.execute(request);

    // Find approval URL to redirect the user
    const approvalUrl = order.result.links.find(
      (link) => link.rel === "approve"
    ).href;

    // Save order info to your database here if needed
    // ...
    // Suppose userID, cartID, restaurantID, and addressID come from your logic
    // and orderData is an array of items { itemID, quantity, price }.

    const [result] = await pool.execute(
      `INSERT INTO orders (userID, cartID, restaurantID, deliveryAddressID, status, paymentStatus)
   VALUES (?, ?, ?, ?, ?, ?)`,
      [userID, cartID, restaurantID, addressID, "pending", "unpaid"]
    );

    const newOrderID = result.insertId;
    //  localStorage.setItem("orderID", newOrderID);
    // Insert order items
    for (const item of orderData) {
      await pool.execute(
        `INSERT INTO orderDetails (orderID, itemID, quantity, price)
     VALUES (?, ?, ?, ?)`,
        [newOrderID, item.itemID, item.quantity, item.price]
      );
    }

    res.json({
      dbOrderID: newOrderID,
      orderId: order.result.id,
      approvalUrl: approvalUrl,
    });
  } catch (error) {
    console.error("PayPal order creation error:", error);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
});

// API route to capture payment after user approval
app.get("/api/capture-paypal-order", async (req, res) => {
  try {
    const { orderId, paypalID, cartID } = req.query;
    console.log(orderId);

    if (!orderId || !paypalID || !cartID) {
      return res
        .status(400)
        .json({ message: "Token and Payer ID are required" });
    }

    // Create capture request
    const request = new paypal.orders.OrdersCaptureRequest(paypalID);
    request.requestBody({});

    // Execute the capture request
    const paypalClient = getPayPalClient();
    const capture = await paypalClient.execute(request);

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.execute(
        `UPDATE orders
         SET paymentStatus = ?, status = ?
         WHERE orderID = ?`,
        ["paid", "preparing", orderId]
      );

      const [cartItems] = await connection.execute(
        `SELECT itemID, quantity FROM cartItems WHERE cartID = ?`,
        [cartID]
      );

      for (const item of cartItems) {
        await connection.execute(
          `UPDATE items 
           SET quantity = quantity - ? 
           WHERE itemID = ?`,
          [item.quantity, item.itemID]
        );
      }

      await connection.execute(`DELETE FROM cartItems WHERE cartID = ?`, [
        cartID,
      ]);

      await connection.commit();

      res.json({
        success: true,
        captureId: capture.result.id,
        orderDetails: capture.result,
      });
    } catch (error) {
      await connection.rollback();
      console.error("Database transaction error:", error);
      res.status(500).json({ error: "Failed to process order" });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("PayPal capture error:", error);
    res.status(500).json({ error: "Failed to capture payment" });
  }
});
// Handle successful payment
app.get("/payment-success", (req, res) => {
  const token = req.query.token;
  res.redirect(
    `${process.env.FRONTEND_URL}/order-confirmation?orderId=${token}`
  );
});

// Handle canceled payment
app.get("/payment-canceled", (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/checkout?status=canceled`);
});

app.use("/api/auth", authRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/address", addressRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/reviews", reviews);
app.use("/api/contact", contactRoute);
const port = 3006;
server.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
