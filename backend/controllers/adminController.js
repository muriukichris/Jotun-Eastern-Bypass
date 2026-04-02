const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

const listUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "Failed to load users" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body || {};
    const update = {};

    if (req.user && String(req.user.id) === String(id)) {
      if (role || typeof isActive === "boolean") {
        return res.status(400).json({ message: "You cannot modify your own access" });
      }
    }

    if (role) {
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      update.role = role;
    }
    if (typeof isActive === "boolean") update.isActive = isActive;

    const user = await User.findByIdAndUpdate(id, update, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update user" });
  }
};

const analytics = async (req, res) => {
  try {
    const [usersCount, productsCount, ordersCount] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments()
    ]);

    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const since = new Date(today);
    since.setUTCDate(since.getUTCDate() - 6);

    const recentAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          revenue: { $sum: "$total" }
        }
      }
    ]);

    const dailyAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "UTC" }
          },
          count: { $sum: 1 },
          revenue: { $sum: "$total" }
        }
      }
    ]);

    const dailyMap = new Map(dailyAgg.map((d) => [d._id, d]));
    const daily = [];
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(since);
      d.setUTCDate(since.getUTCDate() + i);
      const key = d.toISOString().slice(0, 10);
      const value = dailyMap.get(key) || { count: 0, revenue: 0 };
      daily.push({ date: key, orders: value.count, revenue: value.revenue });
    }

    return res.json({
      usersCount,
      productsCount,
      ordersCount,
      totalRevenue,
      daily,
      last7Days: {
        orders: recentAgg[0]?.count || 0,
        revenue: recentAgg[0]?.revenue || 0
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to load analytics" });
  }
};

module.exports = { listUsers, updateUser, analytics };
