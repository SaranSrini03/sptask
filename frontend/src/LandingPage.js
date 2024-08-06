// src/LandingPage.js
import React from 'react';
import './LandingPage.css'; // We'll create this file for styling

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="header">
        <div className="logo">Finance Sentiment Analyzer</div>
        <nav className="nav">
          <button className="nav-button">Get Started</button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-text">
          <h1>Analyze Market Sentiments with Ease</h1>
          <p>The premier tool for real-time financial sentiment analysis.</p>
          <button className="cta-button">Get Free Tier</button>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <img src="feature1.png" alt="Feature 1" />
          <h2>Accuracy</h2>
          <p>Highly accurate sentiment analysis using advanced AI models.</p>
        </div>
        <div className="feature">
          <img src="feature2.png" alt="Feature 2" />
          <h2>Predicting</h2>
          <p>Forecast market trends with our predictive analytics.</p>
        </div>
      </section>

      <section className="trusted-by">
        <h2>Trusted in production by thousands of teams</h2>
        <div className="logos">
          <img src="logo1.png" alt="Company 1" />
          <img src="logo2.png" alt="Company 2" />
          <img src="logo3.png" alt="Company 3" />
        </div>
      </section>

      <section className="provisioning">
        <h2>Instant Provisioning</h2>
        <p>Provision new analysis environments instantly with our scalable cloud solutions.</p>
        <input type="text" placeholder="Enter your email" />
        <button className="provision-button">Get Started</button>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <h2>Trusted Postgres</h2>
          <div className="stats">
            <div className="stat">
              <h3>750k</h3>
              <p>Databases launched</p>
            </div>
            <div className="stat">
              <h3>99.99%</h3>
              <p>Uptime</p>
            </div>
            <div className="stat">
              <h3>GitHub Stars</h3>
              <p>500+</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
