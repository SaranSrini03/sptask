import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Spline from '@splinetool/react-spline';
import { 
  FaChevronDown, FaPalette, FaCog, FaGlobe, FaBars, FaTimes, 
  FaLanguage, FaFileAlt, FaChartBar, FaInfoCircle, FaQuestionCircle, 
  FaNewspaper, FaLink, FaKeyboard, FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub
} from 'react-icons/fa';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import SignInPage from './SignInPage';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inputType, setInputType] = useState('news');
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [relatedNews, setRelatedNews] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState('General');
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (results) {
      setTimeout(() => {
        const dashboardElement = document.querySelector('.dashboard');
        if (dashboardElement) {
          window.scrollTo({
            top: dashboardElement.offsetTop - 20,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [results]);

  useEffect(() => {
    if (hasAnalyzed && results) {
      const resultSection = document.querySelector('.analysis-results');
      if (resultSection) {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [hasAnalyzed, results]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = {
        [inputType === 'text' ? 'text' : inputType === 'url' ? 'url' : 'news_query']: input
      };
      const response = await axios.post('http://127.0.0.1:5000/analyze', data);
      setResults(response.data);
      setHasAnalyzed(true);  // Set this to true after analysis
  
      if (inputType !== 'news') {
        const newsResponse = await axios.get(`http://127.0.0.1:5000/related_news?query=${input}`);
        setRelatedNews(newsResponse.data);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.error || 'An error occurred');
    }
    setLoading(false);
  };

  const fetchSuggestions = async (value) => {
    if (value.length > 0) {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/autocomplete?query=${value}`);
        setSuggestions(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    if (inputType === 'news') {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setSuggestions([]);
    handleSubmit(new Event('submit'));
  };

  const handleInputTypeChange = (type) => {
    setInputType(type);
    const inputSection = document.querySelector('.input-section');
    inputSection.classList.add('fade');
    setTimeout(() => {
      setInput('');
      setResults(null);
      setSuggestions([]);
      setRelatedNews([]);
      if (type === 'news') {
        handleSubmit(new Event('submit'));
      }
      inputSection.classList.remove('fade');
    }, 300);
  };

  const getPlaceholder = () => {
    switch (inputType) {
      case 'text': return 'Enter your text here...';
      case 'url': return 'Enter a URL to analyze...';
      case 'news': return 'Enter a news query...';
      default: return 'Enter your input here...';
    }
  };

  const getInputDescription = () => {
    switch (inputType) {
      case 'text': return 'Analyze the sentiment of any text you enter.';
      case 'url': return 'Analyze the sentiment of a webpage by entering its URL.';
      case 'news': return 'Search for news articles and analyze their sentiment.';
      default: return 'Choose an input type and start analyzing!';
    }
  };

  const renderSentimentBars = (sentiments, confidences) => {
    const sortedSentiments = sentiments.map((sentiment, index) => ({
      sentiment,
      confidence: confidences[index]
    })).sort((a, b) => b.confidence - a.confidence);

    return (
      <div className="sentiment-bars">
        {sortedSentiments.map(({ sentiment, confidence }, index) => (
          <div key={index} className={`sentiment-bar ${sentiment.toLowerCase()}`}>
            <span>{sentiment}</span>
            <div className="bar-container">
              <div className="bar" style={{ width: `${confidence * 100}%` }}></div>
            </div>
            <span>{(confidence * 100).toFixed(2)}%</span>
          </div>
        ))}
      </div>
    );
  };

  const renderKeywords = (keywords) => (
    <div className="keywords">
      {keywords.map((keyword, index) => (
        <span key={index} className="keyword">{keyword}</span>
      ))}
    </div>
  );

  const renderNewsItem = (item, index) => {
    const sentiment = item.sentiments[0].toLowerCase();
    const confidenceScore = (item.confidences[0] * 100).toFixed(2);
    return (
      <div key={index} className={`news-item ${sentiment}`}>
        <h3>{item.title}</h3>
        <p className="sentiment-label">{sentiment}</p>
        <p className="confidence-score">{confidenceScore}%</p>
        <p className="date">{new Date(item.pub_date).toLocaleString()}</p>
        {renderKeywords(item.keywords)}
        <a href={item.link} target="_blank" rel="noopener noreferrer" className="read-more-btn">
          Read More
        </a>
      </div>
    );
  };

  const renderDashboard = () => {
    if (!results || results.error) return null;

    if (inputType === 'news' && Array.isArray(results)) {
      if (results.length === 0) {
        return <div className="no-results">No news results found.</div>;
      }
      return (
        <div className="news-results">
          <h2>News Analysis Results</h2>
          <div className="news-grid">
            {results.map(renderNewsItem)}
          </div>
        </div>
      );
    }

    if (typeof results === 'object' && !results.error) {
      const { sentiments, confidences, keywords } = results;
      if (!sentiments || !confidences || sentiments.length === 0 || confidences.length === 0) {
        return <div className="error-message">No sentiment data available</div>;
      }
      const primarySentiment = sentiments[0];
      const primaryConfidence = confidences[0];

      return (
        <div className="dashboard">
          <h2>Sentiment Analysis Dashboard</h2>
          <div className="dashboard-grid">
            <div className="card primary-sentiment">
              <h3><FaChartBar /> Primary Sentiment</h3>
              <div className="sentiment-gauge">
                <div className={`gauge ${primarySentiment.toLowerCase()}`} style={{ '--percentage': `${primaryConfidence * 100}%` }}>
                  <div className="gauge-body">
                    <div className="gauge-fill"></div>
                    <div className="gauge-cover">{(primaryConfidence * 100).toFixed(0)}%</div>
                  </div>
                </div>
              </div>
              <p className="sentiment-label">{primarySentiment}</p>
            </div>
            <div className="card sentiment-distribution">
              <h3><FaChartBar /> Sentiment Distribution</h3>
              {renderSentimentBars(sentiments, confidences)}
            </div>
            <div className="card keywords">
              <h3><FaFileAlt /> Keywords</h3>
              {renderKeywords(keywords)}
            </div>
            <div className="card analysis-details">
              <h3><FaInfoCircle /> Analysis Details</h3>
              <p><FaLanguage /> <strong>Language:</strong> English</p>
              <p><FaFileAlt /> <strong>Analysis Type:</strong> {inputType === 'text' ? 'Text Input' : 'URL Content'}</p>
              {inputType === 'text' && <p><strong>Word Count:</strong> {input.split(' ').length}</p>}
              <p><strong>Primary Sentiment:</strong> {primarySentiment}</p>
              <p><strong>Confidence:</strong> {(primaryConfidence * 100).toFixed(2)}%</p>
              {inputType === 'url' && results.headline && (
                <>
                  <p className="headline"><strong>Headline:</strong> {results.headline}</p>
                  <a href={input} target="_blank" rel="noopener noreferrer" className="read-more-btn">
                    Read Full Article
                  </a>
                </>
              )}
            </div>
          </div>
          {relatedNews.length > 0 && (
            <div className="related-news">
              <h3>Related News</h3>
              <div className="news-grid">
                {relatedNews.map(renderNewsItem)}
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return <div className="error-message">{results.error || 'An unexpected error occurred'}</div>;
    }
  };

  const faqData = {
    General: [
      {
        question: "How accurate is StillProfit's sentiment analysis?",
        answer: "Our advanced NLP models achieve an accuracy rate of over 90% across various text types and industries. We continuously update and refine our models to ensure the highest possible accuracy."
      },
      {
        question: "Can StillProfit analyze sentiment in languages other than English?",
        answer: "Currently, we support English, with plans to expand to major world languages in early 2024. We're working on adding support for languages like Spanish, French, German, and Mandarin in our next major update."
      },
      {
        question: "How can StillProfit benefit my business?",
        answer: "StillProfit provides invaluable insights for market research, brand monitoring, customer feedback analysis, and strategic decision-making. Our tools can help you understand public sentiment towards your brand, track competitors, and identify emerging trends in your industry."
      }
    ],
    Pricing: [
      {
        question: "What pricing plans does StillProfit offer?",
        answer: "We offer flexible pricing plans to suit businesses of all sizes, from startups to enterprise-level corporations. Please visit our pricing page for detailed information on our current plans and features."
      },
      {
        question: "Is there a free trial available?",
        answer: "Yes, we offer a 14-day free trial for all our plans. This allows you to explore our features and determine which plan best fits your needs before committing."
      }
    ],
    Features: [
      {
        question: "What types of data can StillProfit analyze?",
        answer: "StillProfit can analyze text from various sources including social media posts, customer reviews, news articles, and more. We also offer URL and PDF analysis capabilities."
      },
      {
        question: "Can I integrate StillProfit with my existing tools?",
        answer: "Yes, StillProfit offers API access and integrations with popular business intelligence and CRM tools. Our development team can also work with you to create custom integrations for your specific needs."
      }
    ],
    Support: [
      {
        question: "What kind of support does StillProfit offer?",
        answer: "We offer 24/7 customer support via email and chat. Our premium plans include dedicated account managers and priority support. We also provide extensive documentation, video tutorials, and regular webinars to help you get the most out of our platform."
      },
      {
        question: "Is my data secure with StillProfit?",
        answer: "Absolutely. We employ state-of-the-art encryption and adhere to strict data protection regulations to ensure your information remains confidential. Our servers are protected by advanced security measures, and we never share your data with third parties."
      }
    ]
  };


  return (
    <div className="App">
      <Spline scene="https://prod.spline.design/Fn4Xsu1f9kukR08t/scene.splinecode" className='spline-background' />
      <header>
        <div className="logo">StillProfit</div>
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <nav className={isMenuOpen ? 'active' : ''}>
          <a href="#overview">Overview</a>
          <a href="#features">Features</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#faq">FAQ</a>
        </nav>
        <button className="cta-button" onClick={() => navigate('/signin')}>Get Started →</button>
      </header>

      <main>
        <div className="hero">
          <div className="hero-content">
            <div className="ai-icon">
              <span className="glow"></span>
              <span className="icon">🤖</span>
            </div>
            <h1 className='heroText'>Sentiment Analysis <span className="highlight">Beyond Imagination</span></h1>
            <p>One analysis away from market insights.</p>
            <div className="input-section">
              <div className="input-type-selector">
                <button
                  className={`type-button ${inputType === 'news' ? 'active' : ''}`}
                  onClick={() => handleInputTypeChange('news')}
                >
                  News
                </button>
                <button
                  className={`type-button ${inputType === 'text' ? 'active' : ''}`}
                  onClick={() => handleInputTypeChange('text')}
                >
                  Text
                </button>
                <button
                  className={`type-button ${inputType === 'url' ? 'active' : ''}`}
                  onClick={() => handleInputTypeChange('url')}
                >
                  URL
                </button>
              </div>
              <div className="input-container">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                  placeholder={getPlaceholder()}
                  aria-label={`Enter ${inputType} for analysis`}
                />
                <button 
                  className="analyze-button" 
                  onClick={handleSubmit} 
                  disabled={loading}
                  aria-label="Analyze input"
                >
                  {loading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
              <p className="input-description">
                {getInputDescription()}
              </p>
            </div>
          </div>
        </div>

        <div className="analysis-results">
          {loading ? (
            <div className="loading-container">
              <div className="loading-animation">
                <div className="pulse"></div>
                <div className="pulse"></div>
                <div className="pulse"></div>
              </div>
              <p>Analyzing...</p>
            </div>
          ) : (
            renderDashboard()
          )}
        </div>

        {showBackToTop && (
          <button 
            className="back-to-top" 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            ↑
          </button>
        )}

        {/* FAQ Section */}
        <section id="faq" className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <p>We're here to help with any questions you have about StillProfit's features and capabilities.</p>
          
          <div className="faq-categories">
            {Object.keys(faqData).map((category) => (
              <button 
                key={category}
                className={`faq-category ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="faq-list">
            {faqData[activeCategory].map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                  <FaChevronDown className="faq-icon" />
                </div>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>StillProfit</h3>
            <p>Empowering decisions through sentiment analysis</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#roadmap">Roadmap</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Connect</h3>
            <div className="social-icons">
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="#" aria-label="GitHub"><FaGithub /></a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Newsletter</h3>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" aria-label="Email for newsletter" />
              <button type="submit" aria-label="Subscribe">Subscribe</button>
            </form>
          </div>
        </div>
      </footer>
      {showTutorial && (
        <div className="tutorial" aria-live="polite">
          <div className="tutorial-content">
            <h2>Welcome to StillProfit!</h2>
            <p>Here's a quick guide to get you started:</p>
            <ol>
              <li>Choose your input type: News, Text, or URL.</li>
              <li>Enter your query or content in the input field.</li>
              <li>Click "Analyze" to see the sentiment analysis results.</li>
              <li>Explore the dashboard to understand the sentiment breakdown.</li>
            </ol>
            <button onClick={() => setShowTutorial(false)}>Got it!</button>
          </div>
        </div>
      )}
      <button className="help-button" onClick={() => setShowTutorial(true)} aria-label="Show tutorial">
        <FaQuestionCircle />
      </button>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;