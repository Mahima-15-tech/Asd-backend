const SupportTicket = require("../models/SupportTicket");
const HelpArticle = require("../models/HelpArticle");
const HelpCategory = require("../models/HelpCategory");

exports.getDashboard = async (req, res) => {
    try {
  
      const userId = req.user._id;
  
      // My Tickets
      const totalTickets = await SupportTicket.countDocuments({
        userId
      });
  
      // Knowledge Base
      const totalArticles = await HelpArticle.countDocuments();
  
      // Popular Topics
      const categories = await HelpCategory.find();
  
      // Recent Tickets
      const recentTickets = await SupportTicket.find({
        userId
      })
        .sort({ createdAt: -1 })
        .limit(5);
  
      // Popular Articles
      const popularArticles = await HelpArticle.find()
        .sort({ views: -1 })
        .limit(5);
  
      res.json({
        status: 1,
        data: {
  
          summary: {
            myTickets: totalTickets,
            knowledgeBase: totalArticles,
            liveSupport: {
              available: true,
              timing: "Mon-Sat | 9:00 AM - 6:00 PM"
            }
          },
  
          categories,
  
          recentTickets,
  
          popularArticles,
  
          contactSupport: {
            phone: "+91 22 1234 5678",
            email: "support@asdcargomate.com",
            liveChat: "Available Now",
            workingHours: "Mon-Sat | 9AM - 6PM"
          }
  
        }
      });
  
    } catch (err) {
  
      res.status(500).json({
        status: 0,
        message: err.message
      });
  
    }
  };


  exports.createTicket = async (req, res) => {

    try {
  
      const ticket = await SupportTicket.create({
  
        userId: req.user._id,
  
        ticketId:
          "TKT-" +
          Date.now(),
  
        ...req.body
  
      });
  
      res.json({
  
        status: 1,
  
        message: "Support Ticket Created",
  
        data: ticket
  
      });
  
    } catch (err) {
  
      res.status(500).json({
  
        status: 0,
  
        message: err.message
  
      });
  
    }
  
  };

  exports.getTickets = async (req, res) => {

    try {
  
      const tickets = await SupportTicket.find({
  
        userId: req.user._id
  
      }).sort({
  
        createdAt: -1
  
      });
  
      res.json({
  
        status: 1,
  
        total: tickets.length,
  
        data: tickets
  
      });
  
    }
  
    catch (err) {
  
      res.status(500).json({
  
        status: 0,
  
        message: err.message
  
      });
  
    }
  
  };

  exports.getTicket = async (req, res) => {

    try {
  
      const ticket = await SupportTicket.findOne({
  
        _id: req.params.id,
  
        userId: req.user._id
  
      });
  
      if (!ticket) {
  
        return res.status(404).json({
  
          status: 0,
  
          message: "Ticket not found"
  
        });
  
      }
  
      res.json({
  
        status: 1,
  
        data: ticket
  
      });
  
    }
  
    catch (err) {
  
      res.status(500).json({
  
        status: 0,
  
        message: err.message
  
      });
  
    }
  
  };


  // =====================================================
// GET ALL HELP ARTICLES
// =====================================================

exports.getArticles = async (req, res) => {

    try {
  
      const { search = "" } = req.query;
  
      const query = {
        title: {
          $regex: search,
          $options: "i"
        }
      };
  
      const articles = await HelpArticle.find(query)
        .sort({ views: -1 });
  
      res.json({
        status: 1,
        total: articles.length,
        data: articles
      });
  
    }
  
    catch (err) {
  
      res.status(500).json({
        status: 0,
        message: err.message
      });
  
    }
  
  };


  // =====================================================
// GET ARTICLE DETAILS
// =====================================================

exports.getArticle = async (req, res) => {

    try {
  
      const article = await HelpArticle.findOne({
        slug: req.params.slug
      });
  
      if (!article) {
  
        return res.status(404).json({
  
          status: 0,
  
          message: "Article not found"
  
        });
  
      }
  
      article.views += 1;
  
      await article.save();
  
      res.json({
  
        status: 1,
  
        data: article
  
      });
  
    }
  
    catch (err) {
  
      res.status(500).json({
  
        status: 0,
  
        message: err.message
  
      });
  
    }
  
  };

  // =====================================================
// GET HELP CATEGORIES
// =====================================================

exports.getCategories = async (req, res) => {

    try {
  
      const categories = await HelpCategory.find();
  
      res.json({
  
        status: 1,
  
        total: categories.length,
  
        data: categories
  
      });
  
    }
  
    catch (err) {
  
      res.status(500).json({
  
        status: 0,
  
        message: err.message
  
      });
  
    }
  
  };

  // =====================================================
// SEARCH KNOWLEDGE BASE
// =====================================================

exports.searchKnowledgeBase = async (req, res) => {

    try {
  
      const { keyword } = req.query;
  
      const articles = await HelpArticle.find({
  
        $or: [
  
          {
            title: {
              $regex: keyword,
              $options: "i"
            }
          },
  
          {
            content: {
              $regex: keyword,
              $options: "i"
            }
          }
  
        ]
  
      });
  
      res.json({
  
        status: 1,
  
        data: articles
  
      });
  
    }
  
    catch (err) {
  
      res.status(500).json({
  
        status: 0,
  
        message: err.message
  
      });
  
    }
  
  };