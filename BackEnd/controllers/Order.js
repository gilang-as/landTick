const models = require("../models");
const jwt = require("jsonwebtoken");
const TransactionModel = models.transaction;
const RouteModel = models.route;
const UserModel = models.users;
const IdentityModel = models.identity;

exports.AddOrder = async (req, res) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  const { user_id } = jwt.verify(token, process.env.SECRET_KEY);
  try {
    console.log(req.body);

    const { id_ticket, total, adults, childs, date_start } = req.body;

    const Ticket = await RouteModel.findOne({
      where: { id: id_ticket }
    });
    const { price } = Ticket;
    const Order = await TransactionModel.create({
      user_id,
      route_id: id_ticket,
      date: date_start,
      total,
      price: price * total,
      status: "unpaid",
      attachment: null
    });

    if (Order) {
      // await IdentityModel.bulkCreate(adults);
      // await IdentityModel.bulkCreate(childs);

      await adults.map(function(value, index) {
        IdentityModel.create({
          transaction_id: Order.id,
          name: value.name,
          category: value.category,
          identity: value.identity
        });
      });

      await childs.map(function(value, index) {
        IdentityModel.create({
          transaction_id: Order.id,
          name: value.name,
          category: value.category,
          identity: value.identity
        });
      });
    }
    res.status(200).send({
      status: true,
      message: "Success Add New Order",
      data: Order
    });

    // const Ticket = await TicketModel.findOne({
    //   where: { id: id_ticket }
    // });
    // if (Ticket) {
    //   const { qty: Stock } = Ticket;
    //   if (Stock == 0) {
    //     res.status(200).send({
    //       status: false,
    //       message: "Ticket Sold Out"
    //     });
    //   } else if (Stock < qty) {
    //     res.status(200).send({
    //       status: false,
    //       message: "Not enough tickets"
    //     });
    //   } else {
    //     const { price, qty: TicketQty } = Ticket;
    //     const Order = await OrderModel.create({
    //       id_ticket,
    //       id_user: user_id,
    //       qty,
    //       total_pice: price * qty,
    //       status: "pending",
    //       attachment: null
    //     });

    //     if (Order) {
    //       const UpdateQty = TicketQty - qty;
    //       await TicketModel.update(
    //         { qty: UpdateQty },
    //         { where: { id: id_ticket } }
    //       );
    //     }
    //     res.status(200).send({
    //       status: true,
    //       message: "Success Add New Order",
    //       data: Order
    //     });
    //   }
    // } else {
    //   res.status(200).send({
    //     status: false,
    //     message: "Ticket not Found",
    //     data: Order
    //   });
    // }
  } catch (err) {
    console.log(err);
  }
};

exports.StatusOrder = async (req, res) => {
  const { id, status } = req.body;
  try {
    const Order = await OrderModel.update({ status }, { where: { id } });
    if (Order) {
      res.status(200).send({
        status: true,
        message: "Success Updated a Status Order"
      });
    } else {
      res
        .status(200)
        .send({ message: "Error Updated a Status Order", status: "false" });
    }
  } catch (err) {
    console.log(err);
  }
};

// exports.DeleteTicket = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const pet = await TicketModel.destroy({ where: { id } });
//     if (pet) {
//       res
//         .status(200)
//         .send({ message: "Success Deleted a Ticket", status: "true" });
//     } else {
//       res
//         .status(200)
//         .send({ message: "Error Deleted a Ticket", status: "false" });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

exports.MyOrders = async (req, res) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  const { user_id } = jwt.verify(token, process.env.SECRET_KEY);
  try {
    const Orders = await OrderModel.findAll({
      include: [
        {
          model: TicketModel,
          as: "ticket",
          attributes: [
            "name_train",
            "type_train",
            "date_start",
            "start_station",
            "destination_station",
            "arrival_time",
            "price",
            "qty"
          ]
        },
        {
          model: UserModel,
          as: "user",
          attributes: [
            "name",
            "username",
            "email",
            "gender",
            "phone",
            "address"
          ]
        }
      ],
      attributes: { exclude: ["id_ticket", "id_user"] },
      where: { id_user: user_id }
    });
    res.status(200).send({
      status: true,
      message: "Success Get My Ticket",
      data: Orders
    });
  } catch (err) {
    console.log(err);
  }
};
