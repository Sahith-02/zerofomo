import '../styles/Students_placed.css';

export default function StudentsPlaced() {
  // Data structure with just 4 regions and their front/back images
  const regions = [
    {
      name: "EUROPE",
      frontImage: "/assets/europe.jpg",
      backImage: "/assets/europe_schools.jpg",
      width: "65%" // First row, first image (70%)
    },
    {
      name: "INDIA",
      frontImage: "/assets/India.jpg",
      backImage: "/assets/indian_schools.jpg",
      width: "35%" // First row, second image (30%)
    },
    {
      name: "OTHERS",
      frontImage: "/assets/others.jpg",
      backImage: "/assets/other_schools.jpg",
      width: "40%" // Second row, first image (20%)
    },
    {
      name: "US & CANADA",
      frontImage: "/assets/us_canada.jpg",
      backImage: "/assets/us_canada_schools.jpg",
      width: "60%" // Second row, second image (80%)
    }
  ];

  return (
    <div className="students-placed-container">
      <h1 className="students-placed-title">We have helped students getting into some prestigious schools</h1>
      
      <div className="region-rows">
        {/* First row: 70% - 30% split */}
        <div className="region-row">
          {regions.slice(0, 2).map((region, index) => (
            <div 
              key={index} 
              className="region-card" 
              style={{ width: region.width }}
            >
              <div className="region-card-inner">
                <div className="region-card-front">
                  <img src={region.frontImage} alt={region.name} className="region-image" />
                </div>
                <div className="region-card-back">
                  <img src={region.backImage} alt={`${region.name} universities`} className="region-back-image" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Second row: 20% - 80% split */}
        <div className="region-row">
          {regions.slice(2, 4).map((region, index) => (
            <div 
              key={index + 2} 
              className="region-card" 
              style={{ width: region.width }}
            >
              <div className="region-card-inner">
                <div className="region-card-front">
                  <img src={region.frontImage} alt={region.name} className="region-image" />
                </div>
                <div className="region-card-back">
                  <img src={region.backImage} alt={`${region.name} universities`} className="region-back-image" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}