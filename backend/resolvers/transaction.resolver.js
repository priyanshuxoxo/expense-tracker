import Transaction from "../models/transaction.model.js";
const transactionResolver = {
  Query: {
    transactions: async (_, _, context) => {
      try {
        if (!context.getUser()) {
          throw new Error("Unauthorized");
        }
        const userId = await context.getUser()._id;
        const transactions = await Transaction.find({ userId });
        console.log(transactions);

        return transactions;
      } catch (error) {
        console.error("Error fetching transactions:", error);

        throw new Error("Failed to fetch transactions: " + error.message);
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (error) {
        console.error("Error fetching transaction:", error);
        throw new Error("Failed to fetch transaction: " + error.message);
      }
    },
    // TODO -> Add categoryStatistis typedef
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });
        await newTransaction.save();
      } catch (error) {
        console.error("Error creating transaction:", error);

        throw new Error("Failed to create transaction: " + error.message);
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          { $set: input },
          { new: true },
        );
        return updatedTransaction;
      } catch (error) {
        console.error("Error updating transaction:", error);

        throw new Error("Failed to update transaction: " + error.message);
      }
    },
    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction =
          await Transaction.findByIdAndDelete(transactionId);
        return deletedTransaction;
      } catch (error) {
        console.error("Error deleting transaction:", error);

        throw new Error("Failed to delete transaction: " + error.message);
      }
    },
  },
  // TODO -> Add Transaction/user relationship
};

export default transactionResolver;
