import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Home.css'

gsap.registerPlugin(ScrollTrigger)

const Home = () => {
  const { user, isOrganizer } = useAuth()

  // Refs for all sections
  const heroRef = useRef(null)
  const productRef = useRef(null)
  const howItWorksRef = useRef(null)
  const valueRef = useRef(null)
  const featuresRef = useRef(null)
  const socialRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    initAnimations()

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const initAnimations = () => {
    // SAFE GSAP ANIMATIONS - Elements visible by default, animations enhance on scroll

    // 1. HERO SECTION - Gentle scale and fade effects on visible elements
    const heroElements = gsap.utils.toArray('.hero-title, .hero-subtitle, .hero-section .btn-primary')
    heroElements.forEach((el) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        },
        scale: 1.02,
        duration: 0.6,
        ease: 'power2.out',
        yoyo: true
      })
    })

    // 2. Product mockup hover effect
    const productMockup = document.querySelector('.product-mockup')
    if (productMockup) {
      productMockup.addEventListener('mouseenter', () => {
        gsap.to(productMockup, {
          scale: 1.05,
          duration: 0.4,
          ease: 'power2.out'
        })
      })

      productMockup.addEventListener('mouseleave', () => {
        gsap.to(productMockup, {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        })
      })
    }

    // 3. VALUE SECTION - Subtle entrance effects
    gsap.to('.value-visual', {
      scrollTrigger: {
        trigger: valueRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      scale: 1.02,
      duration: 0.8,
      ease: 'power2.out'
    })

    // 4. Animate stats counter on scroll
    document.querySelectorAll('.stat-number').forEach(stat => {
      const text = stat.textContent
      const match = text.match(/(\d+)/)
      if (match) {
        const finalValue = parseInt(match[1])
        const suffix = text.replace(/\d+/, '')

        let hasAnimated = false

        ScrollTrigger.create({
          trigger: stat,
          start: 'top 85%',
          onEnter: () => {
            if (!hasAnimated) {
              hasAnimated = true
              const obj = { val: 0 }
              gsap.to(obj, {
                val: finalValue,
                duration: 2,
                ease: 'power2.out',
                onUpdate: function() {
                  stat.textContent = Math.floor(obj.val) + suffix
                },
                onComplete: function() {
                  stat.textContent = finalValue + suffix
                }
              })
            }
          }
        })
      }
    })

    // 5. FEATURES - Gentle scale on scroll
    const featureSlides = gsap.utils.toArray('.feature-slide')
    featureSlides.forEach(slide => {
      gsap.to(slide.querySelector('.feature-visual'), {
        scrollTrigger: {
          trigger: slide,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        scale: 1.03,
        duration: 0.8,
        ease: 'power2.out'
      })
    })

    // 6. Testimonials - Gentle lift on hover
    document.querySelectorAll('.testimonial').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -8,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })

    // 7. Button hover effects
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          scale: 1.05,
          duration: 0.3,
          ease: 'back.out(1.7)'
        })
      })

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })

    // 8. Scroll indicator animation
    gsap.to('.scroll-indicator', {
      y: 10,
      duration: 1.5,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    })

    // 9. Parallax effect on hero section
    gsap.to('.hero-section', {
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      backgroundPosition: '50% 100%',
      ease: 'none'
    })

    // 10. HOW IT WORKS - Stagger reveal for steps
    const steps = gsap.utils.toArray('.step')
    steps.forEach((step, index) => {
      gsap.to(step, {
        scrollTrigger: {
          trigger: step,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 0,
        duration: 0.8,
        delay: index * 0.15,
        ease: 'power3.out'
      })

      // Animate step number on scroll
      const stepNumber = step.querySelector('.step-number')
      if (stepNumber) {
        gsap.to(stepNumber, {
          scrollTrigger: {
            trigger: step,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 1.1,
          duration: 0.6,
          ease: 'back.out(1.7)'
        })
      }
    })

    // 11. VALUE SECTION - Enhanced list item reveals
    const valueListItems = gsap.utils.toArray('.value-list li')
    valueListItems.forEach((item, index) => {
      gsap.to(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        },
        x: 0,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'power2.out'
      })
    })

    // 12. FEATURE BENEFITS - Stagger reveal
    document.querySelectorAll('.feature-slide').forEach(slide => {
      const benefits = slide.querySelectorAll('.feature-benefits span')
      benefits.forEach((benefit, index) => {
        gsap.to(benefit, {
          scrollTrigger: {
            trigger: slide,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          scale: 1,
          duration: 0.4,
          delay: index * 0.1,
          ease: 'back.out(1.7)'
        })
      })
    })

    // 13. SECTION HEADERS - Fade and slide up
    document.querySelectorAll('.section-header').forEach(header => {
      gsap.to(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      })
    })

    // 14. FOOTER - Gentle reveal
    gsap.to('.site-footer', {
      scrollTrigger: {
        trigger: '.site-footer',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    })

    // 15. Social links hover - Stagger effect
    const socialLinks = document.querySelectorAll('.social-links a')
    socialLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          y: -5,
          duration: 0.3,
          ease: 'back.out(1.7)'
        })
      })
      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })
  }

  return (
    <div className="home-minimal">
      {/* Section 1: Hero */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Where Streamers<br/>Build Empires</h1>
          <p className="hero-subtitle">The most powerful platform for live streaming creators. Go live in seconds, engage millions, and grow your brand with tools designed for success.</p>
          {!user ? (
            <Link to="/signup" className="btn-primary">Start Streaming Free</Link>
          ) : isOrganizer ? (
            <Link to="/dashboard" className="btn-primary">Go Live Now</Link>
          ) : (
            <Link to="/events" className="btn-primary">Explore Streams</Link>
          )}
        </div>
        <div ref={productRef} className="product-showcase">
          <div className="product-mockup">
            <div className="mockup-screen">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="mockup-content">
                <div className="stream-preview">
                  <div className="stream-player"></div>
                  <div className="stream-info">
                    <div className="info-line"></div>
                    <div className="info-line short"></div>
                  </div>
                </div>
                <div className="chat-preview">
                  <div className="chat-message"></div>
                  <div className="chat-message"></div>
                  <div className="chat-message"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section ref={howItWorksRef} className="how-it-works-section">
        <div className="section-header">
          <h2>Go Live in 3 Simple Steps</h2>
          <p>No complicated setup. No technical headaches. Just pure streaming magic.</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">01</div>
            <h3>Create Your Event</h3>
            <p>Set up your stream in under 60 seconds. Add a title, description, and schedule. We handle the rest.</p>
          </div>
          <div className="step">
            <div className="step-number">02</div>
            <h3>Share Your Link</h3>
            <p>Get a beautiful streaming page instantly. Share it anywhere—social media, email, or embed it on your site.</p>
          </div>
          <div className="step">
            <div className="step-number">03</div>
            <h3>Engage & Grow</h3>
            <p>Watch your audience connect in real-time. Built-in chat, reactions, and analytics help you understand and grow your community.</p>
          </div>
        </div>
      </section>

      {/* Section 3: Value Proposition */}
      <section ref={valueRef} className="value-section">
        <div className="value-content">
          <div className="value-visual">
            <div className="graph-container">
              <div className="graph-line"></div>
              <div className="graph-bars">
                <div className="bar" style={{height: '60%'}}></div>
                <div className="bar" style={{height: '75%'}}></div>
                <div className="bar" style={{height: '90%'}}></div>
                <div className="bar" style={{height: '100%'}}></div>
              </div>
            </div>
          </div>
          <div className="value-text">
            <h2>Built for Growth,<br/>Designed for Impact</h2>
            <p className="value-intro">Every feature on Streamly is crafted to help you reach more viewers, build stronger communities, and create unforgettable live experiences.</p>
            <ul className="value-list">
              <li>
                <strong>Real-time Engagement</strong>
                <span>Interactive chat, live reactions, and instant notifications keep your community buzzing</span>
              </li>
              <li>
                <strong>Community Tools</strong>
                <span>Moderation controls, viewer management, and engagement insights in one place</span>
              </li>
              <li>
                <strong>Smart Analytics</strong>
                <span>Track what matters: viewer retention, peak times, and audience demographics</span>
              </li>
              <li>
                <strong>Enterprise Security</strong>
                <span>Bank-grade encryption, DDoS protection, and 99.9% uptime guarantee</span>
              </li>
            </ul>
            <div className="value-stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Active Creators</span>
              </div>
              <div className="stat">
                <span className="stat-number">2M+</span>
                <span className="stat-label">Monthly Viewers</span>
              </div>
              <div className="stat">
                <span className="stat-number">98%</span>
                <span className="stat-label">Uptime SLA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Feature Showcase */}
      <section className="feature-showcase-section">
        <div className="section-header">
          <h2>Everything You Need to Succeed</h2>
          <p>Professional-grade features that scale with your ambition</p>
        </div>
      </section>

      {/* Section 5: Features (3 subsections) */}
      <section ref={featuresRef} className="features-section">
        <div className="feature-slide" data-feature="1">
          <div>
            <div className="feature-content">
              <h3>Instant Setup, Zero Friction</h3>
              <p>Forget complex OBS configurations and RTMP servers. Just paste your stream URL and hit "Go Live." Your audience sees a stunning, responsive player on any device—desktop, tablet, or mobile.</p>
              <div className="feature-benefits">
                <span>✓ One-click streaming</span>
                <span>✓ Auto-optimized quality</span>
                <span>✓ Mobile-first design</span>
              </div>
            </div>
            <div className="feature-visual feature-1">
              <div className="link-icon">
                <div className="link-circle"></div>
                <div className="link-line"></div>
                <div className="link-circle"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="feature-slide" data-feature="2">
          <div>
            <div className="feature-content">
              <h3>Real Connections, Real Time</h3>
              <p>Your viewers aren't just watching—they're part of the show. Lightning-fast chat, emoji reactions, and smart moderation tools create the kind of vibrant community that keeps people coming back stream after stream.</p>
              <div className="feature-benefits">
                <span>✓ Sub-second chat latency</span>
                <span>✓ Custom reactions & emotes</span>
                <span>✓ AI-powered moderation</span>
              </div>
            </div>
            <div className="feature-visual feature-2">
              <div className="chat-bubbles">
                <div className="bubble bubble-1"></div>
                <div className="bubble bubble-2"></div>
                <div className="bubble bubble-3"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="feature-slide" data-feature="3">
          <div>
            <div className="feature-content">
              <h3>Data That Drives Decisions</h3>
              <p>Stop guessing, start growing. Our analytics dashboard shows you exactly what's working: which streams pop off, when your audience is most active, and how to optimize every broadcast for maximum impact.</p>
              <div className="feature-benefits">
                <span>✓ Real-time viewer metrics</span>
                <span>✓ Engagement heatmaps</span>
                <span>✓ Growth trend analysis</span>
              </div>
            </div>
            <div className="feature-visual feature-3">
              <div className="analytics-chart">
                <div className="chart-arrow"></div>
                <div className="chart-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Social Proof */}
      <section ref={socialRef} className="social-section">
        <div className="social-section-content">
          <div className="section-header">
            <h2>Loved by Creators.<br/>Built for Everyone.</h2>
            <p>From gaming to music, tech to talk shows—thousands of streamers trust Streamly to power their live content and grow their communities.</p>
          </div>

          <div className="testimonials">
            <div className="testimonial">
              <p className="quote">"Streamly transformed how I connect with my audience. The engagement tools are unmatched, and I've seen a 3x increase in viewer retention since switching."</p>
              <p className="author">Sarah Chen</p>
              <p className="author-role">Gaming Creator • 150K Followers</p>
            </div>
            <div className="testimonial">
              <p className="quote">"Finally, a streaming platform that just works. No hassle, just results. I went from struggling with tech to focusing 100% on my music performances."</p>
              <p className="author">Marcus Thompson</p>
              <p className="author-role">Music Streamer • 80K Followers</p>
            </div>
            <div className="testimonial">
              <p className="quote">"The analytics helped me triple my viewership in three months. Now I know exactly when to stream and what content my audience wants to see."</p>
              <p className="author">Alex Rivera</p>
              <p className="author-role">Tech Streamer • 200K Followers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Final CTA */}
      <section ref={ctaRef} className="cta-section">
        <div className="cta-content">
          <h2>Your Audience is Waiting</h2>
          <p className="cta-subtitle">Join 10,000+ creators building their streaming empire on Streamly. Start free, scale infinitely.</p>
          <div className="cta-buttons">
            {!user ? (
              <>
                <Link to="/signup" className="btn-primary">Start Streaming Free</Link>
                <Link to="/login" className="btn-secondary">Sign In</Link>
              </>
            ) : isOrganizer ? (
              <>
                <Link to="/dashboard" className="btn-primary">Go Live Now</Link>
                <Link to="/events" className="btn-secondary">Browse Streams</Link>
              </>
            ) : (
              <>
                <Link to="/events" className="btn-primary">Explore Streams</Link>
                <Link to="/signup" className="btn-secondary">Become a Creator</Link>
              </>
            )}
          </div>
          <p className="cta-note">No credit card required • Free forever plan • Upgrade anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-column footer-brand">
            <h3 className="footer-logo">📺 Streamly</h3>
            <p>The streaming platform built for creators who refuse to be ordinary.</p>
            <div className="social-links">
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="YouTube">▶</a>
              <a href="#" aria-label="Discord">💬</a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Analytics</a>
            <a href="#">Security</a>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">API Reference</a>
            <a href="#">Community</a>
            <a href="#">Blog</a>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
            <a href="#">Press Kit</a>
          </div>

          <div className="footer-column">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
            <a href="#">DMCA</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Streamly. All rights reserved.</p>
          <p>Built with 💜 for creators everywhere</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
