import { useRef, useEffect } from 'react';
import '../styles/About.css';
import Header from '../components/Header';

const About = () => {
  const sectionsRef = useRef([]);

  const sections = [
    {
      id: 1,
      title: "Why start this, when others already exist?",
      content: `For every student who dares to dream—wherever they're starting from. This platform was born out of a simple, urgent question: What about the students who never make the spotlight? 
      While guiding hundreds of students from all walks of life—some aiming for Ivy Leagues and top business schools, others just trying to figure out their next step—I saw a troubling pattern. The spotlight often shone only on the highest scorers, the most polished profiles, the loudest success stories. But behind the scenes were many more students with real potential, important questions, and big dreams—just waiting to be heard.`,
      image: true,
      imagePosition: 'right',
      imageUrl: '../assets/about_1.jpg',
      altText: "Student studying and dreaming about future"
    },
    {
      id: 2,
      title: "Who is this really for?",
      content: `This is for students with big goals and honest questions — whether they're aiming for the Ivy League or still figuring out their next step. I've worked with students who had exceptional academic and professional achievements, helping them get into top universities abroad and in India. I've also supported students with average grades, unconventional paths, or late starts — students who just needed someone to believe in them. No matter where they started or what their background was, they all deserved the same care, respect, and opportunity.
      And it's just as much for parents. Whether you're deeply involved, feeling unsure about the process, or just looking for clarity in a system that can feel overwhelming — we're here for you too. You may not always know what path your child should take, and that's okay. We'll help you stay informed, involved, and confident, so you can support your child with both clarity and heart.`,
      image: true,
      imagePosition: 'right',
      imageUrl: '../assets/about_2.jpg',
      altText: "Scrabble tiles spelling out 'They all matter'"
    },
    {
      id: 3,
      title: "What are we here to change?",
      content: `I've seen how the pressure of elite schools and high-achieving profiles can make students feel like they're missing out if they don't land the same spots. That's why I'm here to eliminate FOMO—the fear of missing out.
      I want every student to understand that success isn't just about a brand name or a prestigious admit. It's about finding the right fit, building your own path, and realizing that no matter where you go, your journey matters.`,
      image: true,
      imagePosition: 'right',
      imageUrl: '../assets/about_3.jpg',
      altText: "Question mark symbol representing curiosity"
    },
    {
      id: 4,
      title: "What makes this different?",
      content: `This platform was built for all of them:
        For the high achievers aiming for the top.
        For those still figuring it out but ready to grow.
        For the families looking for guidance they can trust.
      I'm not here to sell dreams wrapped in glossy logos. I'm here to build a space where success is defined by growth, not just brand names. Where support is personalized, honest, and accessible. Where every student feels seen, understood, and empowered.`,
      image: true,
      imagePosition: 'bottom',
      imageUrl: '../assets/about_4.jpg',
      altText: "Person pointing at important information"
    },
    {
      id: 5,
      title: "Who's behind this?",
      content: `That's why I teamed up with a group of passionate, talented people who share the same mission: to create something more human, more inclusive, and genuinely impactful.
      This is not just about admissions. It's about unlocking what's possible when someone finally says:
      Yes, you belong.`,
      image: true,
      imagePosition: 'right',
      imageUrl: '../assets/about_5.jpg',
      altText: "Team working together on education project"
    }
  ];

  // Optional: Add scroll animation effect
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    sectionsRef.current.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div>
      <Header />
      <div className="about-container">
        {sections.map((section, index) => (
          <div 
            key={section.id}
            className={`about-section ${section.id === 4 ? 'section-special' : ''}`}
            ref={el => sectionsRef.current[index] = el}
          >
            {section.id === 4 ? (
              <div className="section-content special-layout">
                <h2 className="section-title">{section.title}</h2>
                
                {section.image && (
                  <div className="image-container slide4-image">
                    <img 
                      src={section.imageUrl} 
                      alt={section.altText} 
                      className="section-image slide4-image"
                    />
                  </div>
                )}
                
                <div className="section-text" style={{ textAlign: "center" }}>
                  {section.content.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph.trim()}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`section-content layout-${section.imagePosition}`}>
                {/* Desktop view maintains original layout */}
                <div className="desktop-view">
                  {section.id === 2 ? (
                    <>
                      <div className="image-container">
                        <img 
                          src={section.imageUrl} 
                          alt={section.altText} 
                          className="section-image"
                        />
                      </div>
                      
                      <div className="text-content">
                        <h2 className="section-title">{section.title}</h2>
                        <div className="section-text">
                          {section.content.split('\n').map((paragraph, i) => (
                            <p key={i}>{paragraph.trim()}</p>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {section.image && section.imagePosition === 'left' && (
                        <div className="image-container">
                          {section.imageContent && (
                            <div className="scrabble-tiles">
                              {section.imageContent}
                            </div>
                          )}
                          <img 
                            src={section.imageUrl} 
                            alt={section.altText} 
                            className="section-image"
                          />
                        </div>
                      )}
                      
                      <div className="text-content">
                        <h2 className="section-title">{section.title}</h2>
                        <div className="section-text">
                          {section.content.split('\n').map((paragraph, i) => (
                            <p key={i}>{paragraph.trim()}</p>
                          ))}
                        </div>
                      </div>
                      
                      {section.image && section.imagePosition === 'right' && (
                        <div className="image-container">
                          <img 
                            src={section.imageUrl} 
                            alt={section.altText} 
                            className="section-image"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Mobile view with title, image, content structure */}
                <div className="mobile-view">
                  <h2 className="section-title">{section.title}</h2>
                  
                  {section.image && (
                    <div className="image-container">
                      <img 
                        src={section.imageUrl} 
                        alt={section.altText} 
                        className="section-image"
                      />
                    </div>
                  )}
                  
                  <div className="section-text">
                    {section.content.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph.trim()}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;