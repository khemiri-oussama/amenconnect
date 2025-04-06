// controllers/historiqueController.js
const Virement = require("../models/virement");
const VirementGroupe = require("../models/VirementGroupe");
const VirementProgramme = require("../models/VirementProgramme");

// Helper function to format dates
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR");
};

exports.getHistorique = async (req, res) => {
  try {
    // Convert user's compteIds into an array of strings
    const userCompteIds = req.user?.compteIds?.map((id) => id.toString()) || [];

    // Filter for single virements: match if sender or receiver is one of the user's accounts.
    const virementFilter = {
      $or: [
        { fromAccount: { $in: userCompteIds } },
        { toAccount: { $in: userCompteIds } }
      ]
    };

    // Pagination parameters
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const virements = await Virement.find(virementFilter)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    // For grouped virements: match if either the group’s fromAccount or toAccount is one of the user's accounts.
    const groupeFilter = {
      $or: [
        { fromAccount: { $in: userCompteIds } },
        { toAccount: { $in: userCompteIds } }
      ]
    };
    const groupes = await VirementGroupe.find(groupeFilter)
      .sort({ createdAt: -1 })
      .lean();

    // For programmed virements: match if either fromAccount or toAccount is one of the user's accounts.
    const programmeFilter = {
      $or: [
        { fromAccount: { $in: userCompteIds } },
        { toAccount: { $in: userCompteIds } }
      ]
    };
    const programmes = await VirementProgramme.find(programmeFilter)
      .sort({ createdAt: -1 })
      .lean();

    // Map single virements
    const mappedVirements = virements.map((v) => {
      const rawDate = v.createdAt; // ISO string
      return {
        _id: v._id.toString(),
        date: formatDate(v.createdAt), // for display if needed
        rawDate, // include this for chart calculations
        description: v.description,
        beneficiary: v.toAccount,
        amount: v.amount,
        type: userCompteIds.includes(v.fromAccount?.toString()) ? "debit" : "credit",
        status: v.status,
        reference: `VIR-${v._id.toString().slice(-6)}`,
      };
    });
    
    
    // Map grouped virements
    let mappedGroupes = [];
    groupes.forEach((group) => {
      group.virements.forEach((entry) => {
        // Determine type: if the user's account is the sender or not.
        // For groups, you can decide based on group.fromAccount (if that's where the funds come from)
        const isSender = userCompteIds.includes(group.fromAccount?.toString());
        mappedGroupes.push({
          _id: `${group._id.toString()}-${entry._id.toString()}`,
          date: formatDate(group.createdAt),
          amount: entry.amount,
          description: entry.motif || "Virement groupé",
          type: isSender ? "debit" : "credit",
          status: group.status === "Pending" ? "pending" : "completed",
          beneficiary: `Bénéficiaire ${entry.beneficiary}`,
          reference: `GRP-${group._id.toString().slice(-6)}-${entry._id.toString().slice(-4)}`,
        });
      });
    });

    // Map programmed virements
    const mappedProgrammes = programmes.map((p) => {
      // Determine type: if the user's account is the sender.
      const isSender = userCompteIds.includes(p.fromAccount?.toString());
      return {
        _id: p._id.toString(),
        date: formatDate(p.createdAt),
        amount: p.amount,
        description: p.description || `Virement programmé (${p.frequency})`,
        type: isSender ? "debit" : "credit",
        status: p.status === "Scheduled" ? "pending" : "completed",
        beneficiary: `Bénéficiaire ${p.toAccount}`,
        reference: `PRG-${p._id.toString().slice(-6)}`,
      };
    });

    const allTransactions = [
      ...mappedVirements,
      ...mappedGroupes,
      ...mappedProgrammes,
    ].sort((a, b) => new Date(b.date) - new Date(a.date)); // sort descending by date

    res.json({
      page: Number(page),
      limit: Number(limit),
      total: allTransactions.length,
      transactions: allTransactions,
    });
  } catch (error) {
    console.error("Error fetching historique:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
