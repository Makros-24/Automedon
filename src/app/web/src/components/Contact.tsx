import { motion } from 'motion/react';
import { useInViewOnce } from '../hooks/useInViewOnce';
import { Mail, Github, Linkedin, MapPin, Phone, Send } from 'lucide-react';
import { Button } from './ui/button';

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    value: 'alex.thompson@example.com',
    href: 'mailto:alex.thompson@example.com',
    description: 'Send me an email'
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: '/in/alexthompson',
    href: 'https://linkedin.com/in/alexthompson',
    description: 'Connect on LinkedIn'
  },
  {
    icon: Github,
    label: 'GitHub',
    value: '/alexthompson',
    href: 'https://github.com/alexthompson',
    description: 'View my code'
  }
];

export function Contact() {
  const { ref: sectionRef, isInView: isVisible } = useInViewOnce({ 
    threshold: 0.15, 
    rootMargin: '0px 0px -8% 0px' 
  });

  return (
    <section ref={sectionRef} id="contact" className="relative py-20 px-4">
      {/* Enhanced Background Animation */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      >
        <div className="absolute top-1/4 right-1/3 w-1 h-32 opacity-20 animate-pulse bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full blur-3xl opacity-20 animate-float bg-gradient-to-r from-blue-400/20 to-purple-500/20" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 right-1/5 w-64 h-64 rounded-full blur-2xl opacity-15 animate-float bg-gradient-to-r from-teal-400/15 to-indigo-500/15" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/2 w-32 h-32 rounded-full blur-xl opacity-25 animate-float bg-gradient-to-r from-amber-400/20 to-orange-500/20" style={{ animationDelay: '5s' }} />
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ 
            opacity: isVisible ? 1 : 0, 
            y: isVisible ? 0 : 50,
            scale: isVisible ? 1 : 0.9
          }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-light mb-4 text-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: isVisible ? 1 : 0, 
              y: isVisible ? 0 : 30 
            }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            Let's <span className="font-medium">Connect</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-foreground/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isVisible ? 1 : 0, 
              y: isVisible ? 0 : 20 
            }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            I'm always interested in discussing new opportunities, innovative projects, 
            and connecting with fellow technology enthusiasts.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Contact Information */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            animate={{ 
              opacity: isVisible ? 1 : 0, 
              x: isVisible ? 0 : -50,
              scale: isVisible ? 1 : 0.95
            }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Location */}
            <motion.div 
              className="glass glass-hover rounded-2xl p-6 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: isVisible ? 1 : 0, 
                y: isVisible ? 0 : 30 
              }}
              transition={{ duration: 0.7, delay: 0.8, ease: 'easeOut' }}
              whileHover={{ 
                y: -3,
                scale: 1.02,
                transition: { duration: 0.2, ease: 'easeOut' }
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="glass-light rounded-lg p-3 animate-glow">
                  <MapPin className="h-6 w-6 text-foreground/70" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1 text-foreground">Location</h3>
                  <p className="text-foreground/70">San Francisco, CA</p>
                  <p className="text-sm text-foreground/60 mt-1">
                    Available for remote work and travel
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Methods */}
            <div className="space-y-4">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <motion.a
                    key={method.label}
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block glass glass-hover rounded-xl p-4 transition-all duration-300 group"
                    initial={{ opacity: 0, y: 30, x: -20 }}
                    animate={{ 
                      opacity: isVisible ? 1 : 0, 
                      y: isVisible ? 0 : 30,
                      x: isVisible ? 0 : -20
                    }}
                    transition={{ 
                      duration: 0.7, 
                      delay: 1 + index * 0.15,
                      ease: [0.23, 1, 0.32, 1]
                    }}
                    whileHover={{ 
                      scale: 1.03,
                      y: -2,
                      transition: { duration: 0.2, ease: 'easeOut' }
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="glass-light rounded-lg p-2 group-hover:bg-white/20 transition-colors">
                        <Icon className="h-5 w-5 text-foreground/70 group-hover:text-foreground transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{method.label}</span>
                          <Send className="h-4 w-4 text-foreground/60 group-hover:text-foreground/80 transition-colors" />
                        </div>
                        <p className="text-sm text-foreground/70 truncate">
                          {method.value}
                        </p>
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="glass glass-hover rounded-2xl p-8 text-center"
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ 
              opacity: isVisible ? 1 : 0, 
              x: isVisible ? 0 : 50,
              scale: isVisible ? 1 : 0.95
            }}
            transition={{ duration: 0.9, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ 
              y: -5,
              scale: 1.02,
              transition: { duration: 0.3, ease: 'easeOut' }
            }}
          >
            <div className="space-y-6">
              <motion.div 
                className="glass-light rounded-full w-20 h-20 mx-auto flex items-center justify-center animate-glow"
                initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                animate={{ 
                  opacity: isVisible ? 1 : 0,
                  scale: isVisible ? 1 : 0.5,
                  rotate: isVisible ? 0 : -180
                }}
                transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
              >
                <Phone className="h-8 w-8 text-foreground/70" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isVisible ? 1 : 0, 
                  y: isVisible ? 0 : 20 
                }}
                transition={{ duration: 0.7, delay: 1.4, ease: 'easeOut' }}
              >
                <h3 className="text-xl font-medium mb-2 text-foreground">Ready to Start?</h3>
                <p className="text-foreground/70 mb-6">
                  Let's discuss how I can help architect solutions for your next big project.
                </p>
              </motion.div>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: isVisible ? 1 : 0, 
                  y: isVisible ? 0 : 30 
                }}
                transition={{ duration: 0.8, delay: 1.6, ease: 'easeOut' }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? 1 : 0.9
                  }}
                  transition={{ duration: 0.6, delay: 1.8, ease: 'easeOut' }}
                >
                  <Button 
                    size="lg" 
                    className="w-full glass glass-hover transition-all duration-300 group bg-foreground/10 hover:bg-foreground/20 text-foreground border-white/20"
                    onClick={() => window.open('mailto:alex.thompson@example.com', '_blank')}
                  >
                    <Mail className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Start a Conversation
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? 1 : 0.9
                  }}
                  transition={{ duration: 0.6, delay: 2, ease: 'easeOut' }}
                >
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full glass glass-hover transition-all duration-300 group border-white/20 text-foreground hover:bg-white/10"
                    onClick={() => window.open('https://calendly.com/alexthompson', '_blank')}
                  >
                    <Phone className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Schedule a Call
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div 
                className="text-sm text-foreground/60 pt-4 border-t border-white/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isVisible ? 1 : 0, 
                  y: isVisible ? 0 : 10 
                }}
                transition={{ duration: 0.6, delay: 2.2, ease: 'easeOut' }}
              >
                <p>Response time: Usually within 24 hours</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-16 pt-8"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ 
            opacity: isVisible ? 1 : 0, 
            y: isVisible ? 0 : 30,
            scale: isVisible ? 1 : 0.95
          }}
          transition={{ duration: 0.8, delay: 2.4, ease: 'easeOut' }}
        >
          <p className="text-sm text-foreground/60">
            © 2024 Alex Thompson. Crafted with passion for technology and innovation.
          </p>
        </motion.div>
      </div>
    </section>
  );
}