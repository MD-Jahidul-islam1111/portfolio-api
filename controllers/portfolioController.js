const Portfolio = require("../models/Portfolio");

exports.createPortfolio = async (req, res) => {
    try {
        const { title, description, img, codeLink, liveLink } = req.body;
        const newPortfolio = new Portfolio({ title, description, img, codeLink, liveLink, user: req.user.id });
        await newPortfolio.save();
        res.status(201).json(newPortfolio);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPortfolios = async (req, res) => {
    try {
        const portfolios = await Portfolio.find().populate("user", "username");
        res.status(200).json(portfolios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);
        if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

        if (portfolio.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

        const updatedPortfolio = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedPortfolio);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePortfolio = async (req, res) => {
  try {
      const portfolio = await Portfolio.findById(req.params.id);
      if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

      
      if (portfolio.user.toString() !== req.user.id) {
          return res.status(403).json({ message: "Unauthorized" });
      }

      
      await Portfolio.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: "Portfolio deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
