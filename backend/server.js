const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const cloudinary = require("./cloudinary");
const paypal = require("@paypal/checkout-server-sdk");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

dotenv.config();
const authRoute = require("./routes/auth/authRoute");
const restaurantRoute = require("./routes/restaurants/restaurant");
const cartRoute = require("./routes/Cart/cartRoute");
const addressRoute = require("./routes/Address/addressRoute");
const orderRoute = require("./routes/Order/orderRoute");
const pool = require("./db");

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

    // Configure the order request
    request.requestBody({
      intent: "CAPTURE",
      application_context: {
        return_url: `${process.env.APP_URL}/payment-success`,
        cancel_url: `${process.env.APP_URL}/payment-canceled`,
        brand_name: "Your Food Website Name",
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

    // Process the captured payment (update database, etc.)
    // ...
    //const orderID = /* retrieve your internal orderID from session or DB logic */;
    // const orderID = localStorage.getItem("orderID");
    await pool.execute(
      `UPDATE orders
       SET paymentStatus = ?, status = ?
       WHERE orderID = ?`,
      ["paid", "preparing", orderId]
    );

    await pool.execute(`DELETE FROM cartItems WHERE cartID = ?`, [cartID]);

    res.json({
      success: true,
      captureId: capture.result.id,
      orderDetails: capture.result,
    });
  } catch (error) {
    console.error("PayPal capture error:", error);
    res.status(500).json({ error: "Failed to capture payment" });
  }
});

// Handle successful payment
app.get("/payment-success", (req, res) => {
  // Redirect to your frontend success page
  res.redirect(
    `${process.env.FRONTEND_URL}/order-confirmation?orderId=${req.query.token}`
  );
});

// Handle canceled payment
app.get("/payment-canceled", (req, res) => {
  // Redirect to your frontend checkout page
  res.redirect(`${process.env.FRONTEND_URL}/checkout?status=canceled`);
});

app.use("/api/auth", authRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/address", addressRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
const port = 3006;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
