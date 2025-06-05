import React, { useState, useEffect } from 'react';
import '../styles/Testimonials.css'; // Ensure you have the appropriate CSS file for styling

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      text: "I did not want to study at some random college abroad. I dreamt of studying in a good college and did not want to spend lakhs of parents' money for application help. I wanted personalised help and wanted it for less and that's when I reached out to Hari through Linkedin. She guided me like a best friend and it was very affordable. I am very happy as I got admission into Esade MIM.",
      college: "Esade MIM"
    },
    {
      id: 2,
      text: "I did not have a good CGPA but I am from IIT Madras. I was very skeptical whether I would get HEC or not. I was financially not able to afford a lot for application help as I had to spend a lot for applying also. That's when it sounded like a perfect balance between good guidance and affordability. I got into HEC and ESSEC. Happiest phase of my life!",
      college: "HEC & ESSEC"
    },
    {
      id: 3,
      text: "To be honest, I had a great profile with good CGPA, good scores and overall profile but I wanted some helping hand to put it out perfectly. I did not want to be over confident and miss a chance. That is why I took their help and I don't regret a bit as I am in Oxford now. I am very happy and content.",
      college: "Oxford"
    },
    {
      id: 4,
      text: "Happiest now as I got admitted into Duke. I always wanted to study at Duke and they helped me in every tiny bit of the process. I had almost zero profile outside the classroom and they helped me build one. Thanks for the help.",
      college: "Duke"
    },
    {
      id: 5,
      text: "Even though I have a good profile I am very bad in interviews, that's when I took their help. I cracked Kellogg and am very very happy because I have secured my place in my dream college and I feel more confident due to my communication skills.",
      college: "Kellogg"
    },
    {
      id: 6,
      text: "I had tried to apply on my own earlier and didn't get through. This time I wanted help but didn't want someone to take over everything. The process felt very balanced. I got into Boston University and I feel proud.",
      college: "Boston University"
    },
    {
      id: 7,
      text: "I thought top schools were not for people like me. I come from a very regular background and didn't know how to even begin. The way things were explained to me made me feel more confident. I got into Georgetown and SMU and I'm just really happy.",
      college: "Georgetown & SMU"
    },
    {
      id: 8,
      text: "I was super late to start, like only 3-4 weeks before deadlines. But somehow everything worked out. The process was calm and clear. I applied to Esade and NTU and got into both. It really helped to have someone keeping me on track.",
      college: "Esade & NTU"
    },
    {
      id: 9,
      text: "All I wanted was someone to not make this a sales pitch. I had spoken to so many consultants who just kept talking about success rates and 'top admits.' What I got here was actual advice. I got into Kellogg and I'm not even sure how to thank them who helped me get here.",
      college: "Kellogg"
    },
    {
      id: 10,
      text: "I was working full-time while applying and honestly didn't think I'd manage. But having someone to just keep things moving, give real-time feedback, and push me forward and that made the difference. Got into SMU and Melbourne. Couldn't have done it alone.",
      college: "SMU & Melbourne"
    },
    {
      id: 11,
      text: "I was feeling super underconfident because I didn't have a perfect profile. But through the process, I realized it's more about owning my story. I got into SPJIMR and honestly feel proud.",
      college: "SPJIMR"
    },
    {
      id: 12,
      text: "Tbh, I was very last-minute with everything. Hadn't even finalized my colleges properly. But once I got some clarity and structure, everything started falling into place. The feedback was honest, not sugarcoated. I ended up getting into ESSEC and IE. Still feels surreal.",
      college: "ESSEC & IE"
    },
    {
      id: 13,
      text: "Honestly, I was tired of everyone telling me different things. Some said apply to HEC, some said don't. I just needed one clear direction. Got that here. I applied and got into HEC. Was the happiest day ever",
      college: "HEC"
    },
    {
      id: 14,
      text: "I used to think I had nothing unique to write about. I had no big leadership positions or achievements. But once I started working on my essays, I realized I did have a story. I got into Bocconi and I'm proud I didn't give up.",
      college: "Bocconi"
    },
    {
      id: 15,
      text: "Everyone around me was going to US schools, but I wasn't sure. I wanted help figuring out what suits me. Got help with shortlisting and also writing the applications. I got into NUS and I feel really good about my decision now.",
      college: "NUS"
    },
    {
      id: 16,
      text: "I was super confused even about which program to apply to MBA, MIM, MSBA? Everything felt overwhelming. But just talking through it helped so much. I ended up applying to Imperial and got in. Feels like I finally made a clear choice.",
      college: "Imperial"
    },
    {
      id: 17,
      text: "I wrote GMAT three times and still didn't get a score I was happy with. I genuinely thought it was over for me. But after some honest talks and lots of thinking, I applied to UCL and got in. I still can't believe it.",
      college: "UCL"
    },
    {
      id: 18,
      text: "My CGPA was low and I kept comparing myself to others. I was ready to settle. But after working on the applications properly, I realised I still had a chance. Got into ESSEC and I'm proud I didn't give up.",
      college: "ESSEC"
    },
    {
      id: 19,
      text: "My interview skills were really bad. I'd panic and say random things. After a few mock sessions, I started improving. I got into ESCP and I actually felt calm during the final interview.",
      college: "ESCP"
    },
    {
      id: 20,
      text: "I truly appreciate the way you patiently listened to my queries and addressed them with such clarity. Your insights have given me a better perspective on my career direction, and I feel more confident about the steps I need to take moving forward. It was a pleasure interacting with you, and I'm genuinely grateful for the guidance you shared.",
      college: "Career Guidance"
    },
    {
      id: 21,
      text: "While preparing for the CAT, I barely thought about anything except the exam. I had no idea how to write a good SOP or what to say in interviews. Everything felt confusing and rushed. I didn't want to mess it up so close to the finish line. The help I got felt more like talking to a friend who just understood everything I was worried about, what I wanted to say, all of it. That made a huge difference. I'm at IIM Bangalore now and honestly, it wouldn't have happened without that support.",
      college: "IIM Bangalore"
    },
    {
      id: 22,
      text: "Everyone told me ISB was super competitive, especially for someone from a tech background like me. But the mentorship helped me showcase my story with clarity. The personal feedback on every detail made a huge difference. And yes, I made it!",
      college: "ISB"
    },
    {
      id: 23,
      text: "I wanted to do something in life but I was not sure of what to study or what to do. After clarity calls, I have decided to study in Canada and I took help for the whole process. I got admitted into Schulich school of business and I am happy.",
      college: "Schulich"
    },
    {
      id: 24,
      text: "I got admission into SP Jain Global MBA. I did not want to miss a chance not getting into this program as I have heard a lot about it from my cousin. The consultant really helped a lot in every step and I felt talking to a best friend all the time is the best thing.",
      college: "SP Jain Global MBA"
    },
    {
      id: 25,
      text: "I had an average CGPA, gre score and no ielts but I wanted to study management in the USA. I took help and got into Georgetown. Their guidance helped me craft my application to the best.",
      college: "Georgetown"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="testimonials-container">
      <div className="testimonials-header">
        <h2>What Our Students Say</h2>
        <p>Real stories from students who achieved their dreams</p>
      </div>
      
      <div className="carousel-container">
        <div 
          className="carousel-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="quote-icon">❝</div>
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-footer">
                <div className="college-badge">{testimonial.college}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="carousel-dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;