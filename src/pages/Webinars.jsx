import React, { useState, useEffect } from "react";
import "../styles/webinars.css"; // Ensure you have the correct path to your CSS file
import Header from "../components/Header"; // Adjust the import path as necessary

const Webinars = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Set launch date (15 days from now)
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 15);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {" "}
      <Header />
      <div className="webinar-coming-soon">
        <div className="webinar-cs-container">
          <h1 className="webinar-cs-title">Coming Soon</h1>
          <div className="webinar-cs-countdown">
            <div className="webinar-cs-time-box">
              <span className="webinar-cs-number">{timeLeft.days}</span>
              <span className="webinar-cs-label">Days</span>
            </div>
            <div className="webinar-cs-time-box">
              <span className="webinar-cs-number">{timeLeft.hours}</span>
              <span className="webinar-cs-label">Hours</span>
            </div>
            <div className="webinar-cs-time-box">
              <span className="webinar-cs-number">{timeLeft.minutes}</span>
              <span className="webinar-cs-label">Minutes</span>
            </div>
            <div className="webinar-cs-time-box">
              <span className="webinar-cs-number">{timeLeft.seconds}</span>
              <span className="webinar-cs-label">Seconds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Webinars;
