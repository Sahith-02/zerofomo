import React, { useState, useEffect } from "react";
import "../styles/HomePage.css";
import { Link } from "react-router-dom";
import { MdOutlineDoubleArrow } from "react-icons/md";
import Header from "../components/Header";
import Student_Home from "../components/Student_Home";
import Parent_Home from "../components/Parent_Home";
import Students_Placed from "../components/Students_Placed";
import MissionStatement from "../components/MissionStatement";
import Roadmap from "../components/Roadmap";
import Footer from "../components/Footer";
import PolicyPopup from "../components/PolicyPopup";
import "../styles/Testimonials.css";
import Testimonials from "../components/Testimonials";

const StudentMission = () => {
  return (
    <MissionStatement
      title="To eliminate your FOMO and fuel your future."
      paragraphs={[
        "Whether you're a topper with a plan or still figuring it out, we are here for you",
        "No noise, no pressure, just real guidance from choosing the right path to cracking admissions, so move forward with confidence.",
        "Whatever your starting point, let's build what's next your way because we believe everyone is capable of becoming someone they are proud of.",
      ]}
      imageUrl="../assets/student_mission.jpg"
      imageAlt="Excited student with laptop and headphones"
      buttonText="LEARN ABOUT OUR SERVICES"
      buttonLink="/student"
      imageHeight="400px" // Smaller height for this mission statement
      imageWidth="450px" // Custom width for this mission statement
    />
  );
};

// Example 2: Parent-focused mission (from second image)
const ParentMission = () => {
  return (
    <MissionStatement
      title="To make sure parents never feel left out of their child's journey."
      paragraphs={[
        "Sometimes, you may not have the knowledge or exposure to the path your child wants to take and that's okay.",
        "Sometimes, you know their strengths and want to ensure they're on the right track.",
        "And sometimes, you're simply worried because they don't seem to have any direction at all.",
        "Whatever the situation, you're not alone.",
        "We're here to help you stay informed, involved, and confident so you can support your child with clarity and heart.",
      ]}
      imageUrl="../assets/parent_mission.jpg"
      imageAlt="Parent and child smiling together"
      buttonText="LEARN ABOUT OUR SERVICES"
      buttonLink="/parent"
      imageHeight="450px" // Taller height for this mission statement
      imageWidth="700px" // Wider width for this mission statement
    />
  );
};

const HomePage = () => {
  // State to track which tab is active (default: 'student')
  const [activeTab, setActiveTab] = useState("student");
  // const [isQueryPopupOpen, setIsQueryPopupOpen] = useState(false);

  const testimonials = [
    {
      id: 1,
      text: "I did not want to study at some random college abroad. I dreamt of studying in a good college and did not want to spend lakhs of parents' money for application help. I wanted personalised help and wanted it for less and that's when I reached out to Hari through Linkedin. She guided me like a best friend and it was very affordable. I am very happy as I got admission into Esade MIM.",
      college: "Esade MIM",
    },
    {
      id: 2,
      text: "I did not have a good CGPA but I am from IIT Madras. I was very skeptical whether I would get HEC or not. I was financially not able to afford a lot for application help as I had to spend a lot for applying also. That's when it sounded like a perfect balance between good guidance and affordability. I got into HEC and ESSEC. Happiest phase of my life!",
      college: "HEC & ESSEC",
    },
    {
      id: 3,
      text: "To be honest, I had a great profile with good CGPA, good scores and overall profile but I wanted some helping hand to put it out perfectly. I did not want to be over confident and miss a chance. That is why I took their help and I don't regret a bit as I am in Oxford now. I am very happy and content.",
      college: "Oxford",
    },
    {
      id: 4,
      text: "Happiest now as I got admitted into Duke. I always wanted to study at Duke and they helped me in every tiny bit of the process. I had almost zero profile outside the classroom and they helped me build one. Thanks for the help.",
      college: "Duke",
    },
    {
      id: 5,
      text: "Even though I have a good profile I am very bad in interviews, that's when I took their help. I cracked Kellogg and am very very happy because I have secured my place in my dream college and I feel more confident due to my communication skills.",
      college: "Kellogg",
    },
    {
      id: 6,
      text: "I had tried to apply on my own earlier and didn't get through. This time I wanted help but didn't want someone to take over everything. The process felt very balanced. I got into Boston University and I feel proud.",
      college: "Boston University",
    },
    {
      id: 7,
      text: "I thought top schools were not for people like me. I come from a very regular background and didn't know how to even begin. The way things were explained to me made me feel more confident. I got into Georgetown and SMU and I'm just really happy.",
      college: "Georgetown & SMU",
    },
    {
      id: 8,
      text: "I was super late to start, like only 3-4 weeks before deadlines. But somehow everything worked out. The process was calm and clear. I applied to Esade and NTU and got into both. It really helped to have someone keeping me on track.",
      college: "Esade & NTU",
    },
    {
      id: 9,
      text: "All I wanted was someone to not make this a sales pitch. I had spoken to so many consultants who just kept talking about success rates and 'top admits.' What I got here was actual advice. I got into Kellogg and I'm not even sure how to thank them who helped me get here.",
      college: "Kellogg",
    },
    {
      id: 10,
      text: "I was working full-time while applying and honestly didn't think I'd manage. But having someone to just keep things moving, give real-time feedback, and push me forward and that made the difference. Got into SMU and Melbourne. Couldn't have done it alone.",
      college: "SMU & Melbourne",
    },
    {
      id: 11,
      text: "I was feeling super underconfident because I didn't have a perfect profile. But through the process, I realized it's more about owning my story. I got into SPJIMR and honestly feel proud.",
      college: "SPJIMR",
    },
    {
      id: 12,
      text: "Tbh, I was very last-minute with everything. Hadn't even finalized my colleges properly. But once I got some clarity and structure, everything started falling into place. The feedback was honest, not sugarcoated. I ended up getting into ESSEC and IE. Still feels surreal.",
      college: "ESSEC & IE",
    },
    {
      id: 13,
      text: "Honestly, I was tired of everyone telling me different things. Some said apply to HEC, some said don't. I just needed one clear direction. Got that here. I applied and got into HEC. Was the happiest day ever",
      college: "HEC",
    },
    {
      id: 14,
      text: "I used to think I had nothing unique to write about. I had no big leadership positions or achievements. But once I started working on my essays, I realized I did have a story. I got into Bocconi and I'm proud I didn't give up.",
      college: "Bocconi",
    },
    {
      id: 15,
      text: "Everyone around me was going to US schools, but I wasn't sure. I wanted help figuring out what suits me. Got help with shortlisting and also writing the applications. I got into NUS and I feel really good about my decision now.",
      college: "NUS",
    },
    {
      id: 16,
      text: "I was super confused even about which program to apply to MBA, MIM, MSBA? Everything felt overwhelming. But just talking through it helped so much. I ended up applying to Imperial and got in. Feels like I finally made a clear choice.",
      college: "Imperial",
    },
    {
      id: 17,
      text: "I wrote GMAT three times and still didn't get a score I was happy with. I genuinely thought it was over for me. But after some honest talks and lots of thinking, I applied to UCL and got in. I still can't believe it.",
      college: "UCL",
    },
    {
      id: 18,
      text: "My CGPA was low and I kept comparing myself to others. I was ready to settle. But after working on the applications properly, I realised I still had a chance. Got into ESSEC and I'm proud I didn't give up.",
      college: "ESSEC",
    },
    {
      id: 19,
      text: "My interview skills were really bad. I'd panic and say random things. After a few mock sessions, I started improving. I got into ESCP and I actually felt calm during the final interview.",
      college: "ESCP",
    },
    {
      id: 20,
      text: "I truly appreciate the way you patiently listened to my queries and addressed them with such clarity. Your insights have given me a better perspective on my career direction, and I feel more confident about the steps I need to take moving forward. It was a pleasure interacting with you, and I'm genuinely grateful for the guidance you shared.",
      college: "Career Guidance",
    },
    {
      id: 21,
      text: "While preparing for the CAT, I barely thought about anything except the exam. I had no idea how to write a good SOP or what to say in interviews. Everything felt confusing and rushed. I didn't want to mess it up so close to the finish line. The help I got felt more like talking to a friend who just understood everything I was worried about, what I wanted to say, all of it. That made a huge difference. I'm at IIM Bangalore now and honestly, it wouldn't have happened without that support.",
      college: "IIM Bangalore",
    },
    {
      id: 22,
      text: "Everyone told me ISB was super competitive, especially for someone from a tech background like me. But the mentorship helped me showcase my story with clarity. The personal feedback on every detail made a huge difference. And yes, I made it!",
      college: "ISB",
    },
    {
      id: 23,
      text: "I wanted to do something in life but I was not sure of what to study or what to do. After clarity calls, I have decided to study in Canada and I took help for the whole process. I got admitted into Schulich school of business and I am happy.",
      college: "Schulich",
    },
    {
      id: 24,
      text: "I got admission into SP Jain Global MBA. I did not want to miss a chance not getting into this program as I have heard a lot about it from my cousin. The consultant really helped a lot in every step and I felt talking to a best friend all the time is the best thing.",
      college: "SP Jain Global MBA",
    },
    {
      id: 25,
      text: "I had an average CGPA, gre score and no ielts but I wanted to study management in the USA. I took help and got into Georgetown. Their guidance helped me craft my application to the best.",
      college: "Georgetown",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Handler to switch tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handler for query button

  const handlequeryGoogleForm = () => {
    window.open("https://forms.gle/f8gAc41gpW2esdWq8", "_blank");
  };
  return (
    <div className="home-container">
      <Header />

      <div className="hero-section">
        <div className="hero-background">
          {/* Desktop banner image */}
          <img
            src="/assets/banner.jpg"
            loading="lazy"
            alt="Student studying"
            className="hero-image desktop-banner"
          />
          {/* Mobile banner image */}
          <img
            src="/assets/banner_mobile_view.jpg"
            alt="Student studying"
            className="hero-image mobile-banner"
          />
        </div>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Find Your Way Forward</h1>
            <p className="hero-tagline">
              Helping Students & Parents Make Confident Decisions —
              <br />
              <span className="strikethrough">Fear of Missing Out</span>
              <span className="highlight">Facts Over Misleading Opinions</span>
            </p>

            <div className="cta-buttons">
              <Link to="/student" className="cta-button">
                <span>👨‍🎓 I am a Student</span>
              </Link>
              <Link to="/parent" className="cta-button">
                <span>👪 I am a Parent</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* No Perfect Profile Section */}
      <div className="profile-section">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-title-box">
              <h2 className="profile-title">
                🎓 No Perfect Profile?
                <br className="mobile-only" /> No Problem.
              </h2>
            </div>
          </div>

          <div className="profile-content-wrapper">
            <div className="profile-image-container">
              <img
                src="/assets/no_profile.jpg"
                alt="Students with different profiles"
                className="no_profile-image"
              />
            </div>
            <div className="profile-content">
              <p className="profile-description">
                High or low GPA. Cracked GMAT, GRE, or CAT or still figuring it
                out. Financially ready or looking for support. All-rounder or
                still finding your spark. We've helped hundreds create their
                success stories.
                <br />
                <span className="profile-description-bottom">
                  Now it's your turn to start yours.
                </span>
              </p>
            </div>
          </div>

          <div className="profile-difference">
            <div className="difference-title-box">
              <h2 className="difference-title">The ZeroFOMO Difference</h2>
            </div>

            <div className="profile-links">
              <button
                className={`profile-link ${
                  activeTab === "student" ? "active" : ""
                }`}
                onClick={() => handleTabChange("student")}
              >
                Student
              </button>
              <button
                className={`profile-link ${
                  activeTab === "parent" ? "active" : ""
                }`}
                onClick={() => handleTabChange("parent")}
              >
                Parent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content section with transition effects */}
      <div className="tab-content-container">
        <div
          className={`tab-content ${activeTab === "student" ? "active" : ""}`}
        >
          {activeTab === "student" && <Student_Home />}
        </div>
        <div
          className={`tab-content ${activeTab === "parent" ? "active" : ""}`}
        >
          {activeTab === "parent" && <Parent_Home />}
        </div>
      </div>

      <Students_Placed />
      <StudentMission />

      {/* Other content */}
      <div style={{ height: "50px" }}></div>

      <ParentMission />
      <Roadmap />
      <div className="testimonials-unique-container">
        <div className="testimonials-unique-header">
          <h2>Our Success Stories</h2>
          <p>You can't fake this kind of love.</p>
        </div>

        <div className="testimonials-unique-carousel-container">
          <div
            className="testimonials-unique-carousel-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonials-unique-card">
                <div className="testimonials-unique-quote-icon">❝</div>
                <p className="testimonials-unique-text">{testimonial.text}</p>
                <div className="testimonials-unique-footer">
                  <div className="testimonials-unique-college-badge">
                    {testimonial.college}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Query Button - Fixed Position */}
      <div className="query-button-container">
        <button className="query-button" onClick={handlequeryGoogleForm}>
          <div className="query-button-content">
            <div className="question-mark">?</div>
          </div>
        </button>
      </div>

      <Footer />
      <PolicyPopup />
    </div>
  );
};

export default HomePage;
