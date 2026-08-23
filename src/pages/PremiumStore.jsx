import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import { Crown, Coins, Gift, PlayCircle, CreditCard } from "lucide-react";

function PremiumStore() {
  const [coins, setCoins] = useState(0);
  const [isClaimedToday, setIsClaimedToday] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Admin configurable settings (LocalStorage se fetch hongi, default values ke sath)
  const [premiumPrice, setPremiumPrice] = useState(50); // Coins required
  const [cashPrice, setCashPrice] = useState(199); // ₹ Amount for direct payment
  const [dailyRewardCoins, setDailyRewardCoins] = useState(1);
  const [adRewardCoins, setAdRewardCoins] = useState(5);

  useEffect(() => {
    const savedCoins = Number(localStorage.getItem("userCoins")) || 0;
    const premiumStatus = JSON.parse(localStorage.getItem("isPremium")) || false;
    
    // Admin settings load karein agar admin panel se set ki gayi ho
    const adminPremPrice = localStorage.getItem("admin_prem_price");
    const adminCashPrice = localStorage.getItem("admin_cash_price");
    const adminDaily = localStorage.getItem("admin_daily_coins");
    const adminAd = localStorage.getItem("admin_ad_coins");

    if (adminPremPrice) setPremiumPrice(Number(adminPremPrice));
    if (adminCashPrice) setCashPrice(Number(adminCashPrice));
    if (adminDaily) setDailyRewardCoins(Number(adminDaily));
    if (adminAd) setAdRewardCoins(Number(adminAd));

    const lastClaimDate = localStorage.getItem("lastClaimDate");
    const today = new Date().toDateString();

    setCoins(savedCoins);
    setIsPremium(premiumStatus);
    if (lastClaimDate === today) {
      setIsClaimedToday(true);
    }
  }, []);

  // Daily Sign-In Reward Handler
  const handleDailyClaim = () => {
    if (isClaimedToday) return;

    const newCoins = coins + dailyRewardCoins;
    setCoins(newCoins);
    setIsClaimedToday(true);

    localStorage.setItem("userCoins", newCoins);
    localStorage.setItem("lastClaimDate", new Date().toDateString());
    alert(`🎉 Success! You claimed your ${dailyRewardCoins} Daily Coin(s)!`);
  };

  // Watch Ad to Earn Coins
  const handleWatchAd = () => {
    alert("📺 Playing promotional ad... (Simulated)");
    setTimeout(() => {
      const newCoins = coins + adRewardCoins;
      setCoins(newCoins);
      localStorage.setItem("userCoins", newCoins);
      alert(`✨ Ad completed! +${adRewardCoins} Coins added to your wallet.`);
    }, 1500);
  };

  // Redeem Premium using Coins
  const handleBuyPremiumWithCoins = () => {
    if (coins < premiumPrice) {
      alert(`❌ Not enough coins! You need at least ${premiumPrice} coins to unlock Premium.`);
      return;
    }

    const remainingCoins = coins - premiumPrice;
    setCoins(remainingCoins);
    setIsPremium(true);

    localStorage.setItem("userCoins", remainingCoins);
    localStorage.setItem("isPremium", JSON.stringify(true));
    alert("👑 Congratulations! You are now a TrueWatch Premium Member using your coins!");
  };

  // Direct Payment Option (UPI / Card Simulation)
  const handleDirectPayment = () => {
    const confirmPay = window.confirm(`Proceed to pay ₹${cashPrice} via UPI/Card for TrueWatch VIP Pass?`);
    if (confirmPay) {
      alert("💳 Processing secure payment... Payment Successful! 🎉");
      setIsPremium(true);
      localStorage.setItem("isPremium", JSON.stringify(true));
    }
  };

  return (
    <main className="page" style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "60px" }}>
      <BackButton />

      {/* Header Banner */}
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <Crown size={48} color="#e50914" style={{ marginBottom: "10px" }} />
        <h1>TrueWatch Rewards & Premium</h1>
        <p style={{ color: "#aaa" }}>Earn free coins, watch ads, or make a direct payment to unlock VIP streaming.</p>
      </div>

      {/* Wallet Balance Card */}
      <div style={{ background: "#171717", border: "1px solid #292929", padding: "20px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Coins size={36} color="#f59e0b" />
          <div>
            <span style={{ fontSize: "13px", color: "#888" }}>My Wallet Balance</span>
            <h2 style={{ margin: 0, fontSize: "24px" }}>🪙 {coins} Coins</h2>
          </div>
        </div>
        <div>
          <span style={{ background: isPremium ? "#22c55e" : "#333", color: "white", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold" }}>
            {isPremium ? "👑 Premium Active" : "Free Plan"}
          </span>
        </div>
      </div>

      {/* Section 1: Daily Sign-In & Earn Coins */}
      <h3 style={{ marginBottom: "15px" }}>🎁 Daily Rewards</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "30px" }}>
        
        {/* Daily Sign-In Card */}
        <div style={{ background: "#171717", border: "1px solid #292929", padding: "20px", borderRadius: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <Gift color="#e50914" size={28} style={{ marginBottom: "10px" }} />
            <strong>Daily Sign-In</strong>
            <p style={{ color: "#aaa", fontSize: "13px", margin: "5px 0 15px 0" }}>Check-in every day to claim your free {dailyRewardCoins} Coin reward.</p>
          </div>
          <button
            onClick={handleDailyClaim}
            disabled={isClaimedToday}
            style={{
              background: isClaimedToday ? "#333" : "#e50914",
              color: isClaimedToday ? "#888" : "white",
              border: "none",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: isClaimedToday ? "not-allowed" : "pointer"
            }}
          >
            {isClaimedToday ? "Claimed Today ✓" : `Claim +${dailyRewardCoins} Coin`}
          </button>
        </div>

        {/* Watch Ad Card */}
        <div style={{ background: "#171717", border: "1px solid #292929", padding: "20px", borderRadius: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <PlayCircle color="#3b82f6" size={28} style={{ marginBottom: "10px" }} />
            <strong>Watch & Earn</strong>
            <p style={{ color: "#aaa", fontSize: "13px", margin: "5px 0 15px 0" }}>Watch short video ads to instantly earn +{adRewardCoins} Coins.</p>
          </div>
          <button
            onClick={handleWatchAd}
            style={{ background: "#1f1f1f", color: "white", border: "1px solid #444", padding: "10px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
          >
            Watch Ad (+{adRewardCoins} Coins)
          </button>
        </div>

      </div>

      {/* Section 2: Get Premium Membership */}
      <h3 style={{ marginBottom: "15px" }}>👑 Upgrade to Premium</h3>
      <div style={{ background: "linear-gradient(135deg, #1f1f1f 0%, #111 100%)", border: "1px solid #e50914", padding: "25px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "15px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, color: "#fff" }}>TrueWatch VIP Pass</h3>
            <p style={{ color: "#ccc", fontSize: "14px", margin: "5px 0 0 0" }}>Zero Ads • Full HD Streaming • Early Access</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "20px", fontWeight: "bold", color: "#e50914" }}>₹{cashPrice} / {premiumPrice} Coins</span>
            <span style={{ display: "block", fontSize: "12px", color: "#888" }}>per month</span>
          </div>
        </div>

        <ul style={{ color: "#bbb", fontSize: "14px", paddingLeft: "20px", margin: "10px 0" }}>
          <li>Ad-free experience across all devices</li>
          <li>High-speed audio & video streaming servers</li>
          <li>Exclusive badge on your profile</li>
        </ul>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={handleBuyPremiumWithCoins}
            style={{ flex: 1, background: "#333", color: "white", border: "1px solid #555", padding: "12px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}
          >
            Pay with {premiumPrice} Coins
          </button>
          
          <button
            onClick={handleDirectPayment}
            style={{ flex: 1, background: "#e50914", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          >
            <CreditCard size={18} /> Pay ₹{cashPrice} (UPI/Card)
          </button>
        </div>
      </div>

    </main>
  );
}

export default PremiumStore;