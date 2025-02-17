import React, { useEffect, useState } from "react";
import { isPlatform } from "@ionic/react";
import HomeMobile from "./HomeMobile";
import HomeDesktop from "./HomeDesktop";
import HomeKiosk from "./HomeKiosk";
import { useHistory } from "react-router-dom";

const Home: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState(window.matchMedia("(orientation: portrait)").matches);
  const [isTouchable, setIsTouchable] = useState(false);
  const [isAgencyIP, setIsAgencyIP] = useState(false); // Add state for IP check
  const isMobile = isPlatform("mobile");
  const history = useHistory();

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
    };

    setIsTouchable("ontouchstart" in window || navigator.maxTouchPoints > 0);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isBorneInteractive = !isMobile && isPortrait && isTouchable;

  console.log("isMobile:", isMobile);
  console.log("isPortrait:", isPortrait);
  console.log("isTouchable:", isTouchable);
  console.log("isBorneInteractive:", isBorneInteractive);

  // Fetch the user's IP address
  const fetchUserIP = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/ip/info");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched IP data:", data);
      return data.clientIP;
    } catch (error) {
      console.error("Error fetching IP address:", error);
      return null;
    }
  };

  // Check if the IP is within the agency range
  const isAgencyIPCheck = (ip: string) => {
    if (!ip) return false;

    if (ip.includes("::ffff:")) {
      ip = ip.split("::ffff:")[1];
    }

    const agencyIPRange = ["192.168.1.0", "192.168.1.255"]; // Example range

    const ipToNumber = (ip: string) =>
      ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);

    const userIPNumber = ipToNumber(ip);
    const startRange = ipToNumber(agencyIPRange[0]);
    const endRange = ipToNumber(agencyIPRange[1]);

    return userIPNumber >= startRange && userIPNumber <= endRange;
  };

  useEffect(() => {
    const checkIPAndRedirect = async () => {
      const userIP = await fetchUserIP();
      console.log(userIP);

      if (userIP && isAgencyIPCheck(userIP)) {
        setIsAgencyIP(true); // Set state to true if IP matches the agency range
      }
    };

    checkIPAndRedirect();
  }, []);

  return (
    <>
      {isAgencyIP ? (
        <HomeKiosk /> // Render HomeKiosk if the IP is within the agency range
      ) : isMobile ? (
        <HomeMobile />
      ) : isBorneInteractive ? (
        <HomeKiosk />
      ) : (
        <HomeDesktop />
      )}
    </>
  );
};

export default Home;
