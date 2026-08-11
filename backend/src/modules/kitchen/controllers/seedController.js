import Order from "../models/Order.js";


export const seedOrders = async (req, res) => {
    try {

        await Order.deleteMany({});


        const orders = [
            {
                orderNumber: "D1001",
                customerName: "Rahul",
                items: [
                    {
                        name: "Margherita",
                        quantity: 2
                    }
                ],
                status: "Placed"
            },

            {
                orderNumber: "D1002",
                customerName: "Aman",
                items: [
                    {
                        name: "Farmhouse",
                        quantity: 1
                    }
                ],
                status: "Placed"
            },

            {
                orderNumber: "D1003",
                customerName: "Riya",
                items: [
                    {
                        name: "Peppy Paneer",
                        quantity: 2
                    }
                ],
                status: "Preparing"
            }
        ];


        await Order.insertMany(orders);


        res.status(201).json({
            success: true,
            message: "Sample orders inserted successfully"
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};