// controllers/virementController.js
const Virement = require("../models/virement");
const Compte = require("../models/Compte");

exports.createVirement = async (req, res) => {
  try {
    const { fromAccount, toAccount, amount, description } = req.body;

    // Validate sender account
    const sender = await Compte.findById(fromAccount);
    if (!sender) {
      return res.status(404).json({ message: "Sender account not found" });
    }

    // Check if sender has sufficient funds
    if (sender.solde < amount) {
      return res.status(400).json({ message: "Insufficient funds in sender account" });
    }

    // Determine processing delay
    let processingDelay = 0;
    // 1. If the amount is more than 10,000, set delay to 30 minutes.
    if (amount > 10000) {
      processingDelay = 30 * 60 * 1000; // 30 minutes in milliseconds
    } else if (toAccount.startsWith("07")) {
      // Look for a receiver account by RIB.
      const receiver = await Compte.findOne({ RIB: toAccount });
      // 2. If the RIB starts with "07" and a matching account exists, process immediately.
      if (receiver) {
        processingDelay = 0;
      } else {
        // 3. RIB starts with "07" but no account found: 5 minutes delay.
        processingDelay = 5 * 60 * 1000; // 5 minutes in milliseconds
      }
    } else {
      // 4. If the RIB does not start with "07", process after 5 minutes.
      processingDelay = 5 * 60 * 1000;
    }

    // Determine initial status based on delay
    const initialStatus = processingDelay === 0 ? "Completed" : "Scheduled";

    // Create the virement record
    const virement = await Virement.create({
      fromAccount,
      toAccount, // storing the RIB (or internal id, if available)
      amount,
      description,
      status: initialStatus,
    });

    // Deduct sender funds immediately (reserve the amount)
    sender.solde -= amount;
    await sender.save();

    // Immediate processing: update receiver's account if found
    if (processingDelay === 0) {
      const receiver = await Compte.findOne({ RIB: toAccount });
      if (receiver) {
        receiver.solde += amount;
        await receiver.save();
      }
      return res.status(201).json({ message: "Virement successful", data: virement });
    } else {
      // Scheduled processing: use setTimeout to complete the virement later
      setTimeout(async () => {
        // Find receiver account at processing time (it might have been created meanwhile)
        const receiver = await Compte.findOne({ RIB: toAccount });
        if (receiver) {
          receiver.solde += amount;
          await receiver.save();
        }
        // Update the virement record to reflect completion
        virement.status = "Completed";
        await virement.save();
      }, processingDelay);
      return res.status(201).json({
        message: `Virement scheduled. It will be processed in ${processingDelay / 60000} minute(s).`,
        data: virement,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
