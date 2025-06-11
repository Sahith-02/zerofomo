import React from "react";
import "../styles/Founder.css"; // Make sure to create this CSS file for styling
import Header from "../components/Header"; // Adjust the import path as necessary
// Make sure to replace with your actual image path

const Founder = () => {
  return (
    <div>
      <Header />
      <div className="founder-container">
        <h1>Hi, I'm Hari Chandana — Founder of ZeroFOMO.</h1>
        <div className="founder-content">
          <div className="founder-image">
            <img
              src="/assets/Founder.jpg"
              alt="Hari Chandana - Founder of ZeroFOMO"
            />
          </div>
          <div className="founder-text">
            <p>
              I was never a topper at school, mainly because I loved sports and
              dance. But I managed to stay in the top 5% in my board exams
              because of my grasping power and knowing how to express things
              well.
            </p>

            <p>Still, that wasn't enough to get into IT's.</p>

            <p>
              I started preparing for GATE, but COVID completely threw things
              off. With ADHD, staying focused during lockdown was even harder. I
              lost momentum. I turned to coding — not because I loved it, but
              because I felt like I had no other choice.
            </p>

            <p>
              I cracked a job at Accenture and worked there for two years in a
              remote role. But honestly, it was a tough time. I felt stuck,
              isolated, and full of FOMO. I wasn't enjoying the work, and it
              slowly got depressing.
            </p>

            <p>
              That's when my friends and family stepped in. They pushed me to
              explore something different — something that actually felt right.
              I took that seriously, worked hard, and earned a scholarship to my
              dream college.
            </p>

            <p>
              Even after getting in, I gave it my all — secured the Accenture
              Chair and landed an apprenticeship at Sanofi, doing what I truly
              loved. I could have relaxed — I was debt-free and had a steady
              monthly income. But I didn't. Because somewhere along the way, I
              discovered something I genuinely enjoyed.
            </p>

            <p>That was mentoring.</p>

            <p>
              While balancing my master's and my apprenticeship, I also
              freelanced for over two years, helping more than 300 students with
              their admissions. And over time, I started hearing a pattern.
            </p>

            <p>
              Most consultancies felt transactional. Students felt more like
              numbers than people. There was pressure, not purpose. Sales talk,
              not real support.
            </p>

            <p>
              That hit me hard, because I've been there. I knew what that
              confusion and helplessness felt like.
            </p>

            <p>And that's how ZeroFOMO was born.</p>

            <p>ZeroFOMO isn't just another consultancy.</p>

            <p>
              It's a purpose-driven platform built on empathy, not pressure.
            </p>

            <p>We:</p>
            <ul>
              <li>Charge nominally</li>
              <li>Treat you like family</li>
              <li>
                Guide you toward what truly fits you — not just what sounds
                flashy
              </li>
            </ul>

            <p>Our mission is simple:</p>
            <p>
              To replace fear and FOMO with clarity, confidence, and direction.
            </p>

            <p>
              If I could turn things around by following what I genuinely love —
              so can you.
            </p>

            <p>Everyone's path is different, and that's the beauty of it.</p>

            <p>
              When you start being grateful and true to yourself, your life
              begins to shift.
            </p>

            <p>Welcome to ZeroFOMO.</p>

            <p>
              We'll walk with you — every step of the way — until you become
              someone you're truly proud of.
            </p>

            <p>Thanks for reading my story.</p>

            <p className="closing-line">Let's make your story even better</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Founder;
