export const removeWalletCookie = async () => {
  await fetch("/api/removeWalletAddress", { method: "POST" });
};
