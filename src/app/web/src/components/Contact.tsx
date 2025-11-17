import { motion } from 'motion/react';
import { useInViewOnce } from '../hooks/useInViewOnce';
import { Mail, MapPin, Phone, Send, Linkedin as LinkedinIcon, Github as GithubIcon, Twitter as TwitterIcon, MessageCircle, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { useContactInfo } from '@/contexts/PortfolioDataContext';

// Animation variants matching Work section pattern
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Helper function to check if it's business hours in Tunisia (GMT+1)
const isBusinessHours = (): boolean => {
  const now = new Date();
  const tunisiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Tunis' }));
  const hours = tunisiaTime.getHours();
  const day = tunisiaTime.getDay();

  // Business hours: Monday-Friday, 9 AM - 6 PM Tunisia time
  const isWeekday = day >= 1 && day <= 5;
  const isWorkingHours = hours >= 9 && hours < 18;

  return isWeekday && isWorkingHours;
};

// Helper function to detect if user is on mobile
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Helper function to generate WhatsApp link
const getWhatsAppLink = (phoneNumber: string, message: string): string => {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);

  if (isMobileDevice()) {
    return `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export function Contact() {
  const { contactInfo: contactData, loading } = useContactInfo();
  const { ref: sectionRef, isInView } = useInViewOnce({ threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  // Prepare contact methods (outside conditional to avoid hooks issues)
  // Filter out empty/undefined contact methods
  const contactMethods = contactData ? [
    // Email - show if exists and not empty
    ...(contactData.email ? [{
      icon: Mail,
      label: 'Email',
      value: contactData.email,
      href: `mailto:${contactData.email}`,
    }] : []),
    // LinkedIn - show if exists and not empty
    ...(contactData.linkedin ? [{
      icon: LinkedinIcon,
      label: 'LinkedIn',
      value: contactData.linkedin.replace('www.linkedin.com/in/', ''),
      href: `https://${contactData.linkedin}`,
    }] : []),
    // GitHub - show if exists and not empty
    ...(contactData.github ? [{
      icon: GithubIcon,
      label: 'GitHub',
      value: contactData.github.replace('github.com/', ''),
      href: `https://${contactData.github}`,
    }] : []),
    // Twitter - show if exists and not empty
    ...(contactData.twitter ? [{
      icon: TwitterIcon,
      label: 'Twitter',
      value: 'Twitter',
      href: `https://${contactData.twitter}`,
    }] : []),
  ] : [];

  return (
    <motion.section
      id="contact"
      className="relative py-20 px-6 overflow-hidden"
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {/* Background Animation - matching Work section pattern */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-10 animate-float bg-gradient-to-r from-blue-400/30 to-purple-500/30" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full blur-2xl opacity-15 animate-float bg-gradient-to-r from-teal-400/25 to-indigo-500/25" style={{ animationDelay: '4s' }} />
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Loading State */}
        {loading ? (
          <div className="text-center mb-16">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-foreground/10 rounded-lg w-64 mx-auto"></div>
              <div className="h-6 bg-foreground/10 rounded-lg w-96 mx-auto"></div>
            </div>
          </div>
        ) : !contactData ? (
          /* Error State */
          <div className="text-center text-foreground/70">
            <p>Contact information not available</p>
          </div>
        ) : (
          /* Main Content */
          <>
            {/* Section Header */}
            <motion.div className="text-center mb-16" variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
                {contactData.title}
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                {contactData.description}
              </p>
            </motion.div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Contact Information */}
          <div className="space-y-6">
            {/* Location Card */}
            <motion.div
              className="glass glass-hover rounded-2xl p-6 transition-all duration-300"
              variants={itemVariants}
              whileHover={{
                y: -3,
                scale: 1.02,
                transition: { duration: 0.2, ease: 'easeOut' }
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="glass-light rounded-lg p-3">
                  <MapPin className="h-6 w-6 text-foreground/70" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 text-foreground">
                    {contactData.locationTitle}
                  </h3>
                  <p className="text-foreground/70 mb-1">{contactData.location}</p>
                  {contactData.phone && (
                    <p className="text-sm text-foreground/60 mb-1">
                      Phone: {contactData.phone}
                    </p>
                  )}
                  <p className="text-sm text-foreground/60">
                    {contactData.locationDescription}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Methods */}
            <div className="space-y-3">
              {contactMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <motion.a
                    key={method.label}
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block glass glass-hover rounded-xl p-4 transition-all duration-300 group"
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.02,
                      y: -2,
                      transition: { duration: 0.2, ease: 'easeOut' }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="glass-light rounded-lg p-2.5 group-hover:bg-white/20 transition-colors duration-300">
                        <Icon className="h-5 w-5 text-foreground/70 group-hover:text-foreground transition-colors duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{method.label}</span>
                          <Send className="h-4 w-4 text-foreground/40 group-hover:text-foreground/80 group-hover:translate-x-0.5 transition-all duration-300" />
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
          </div>

          {/* Right Column: Call to Action Card */}
          <motion.div
            className="glass glass-hover rounded-2xl p-8 text-center h-fit"
            variants={itemVariants}
            whileHover={{
              y: -5,
              scale: 1.02,
              transition: { duration: 0.3, ease: 'easeOut' }
            }}
          >
            <div className="space-y-6">
              {/* Icon */}
              <div className="glass-light rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                <Phone className="h-9 w-9 text-foreground/70" />
              </div>

              {/* Title and Description */}
              <div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">
                  {contactData.cta.title}
                </h3>
                <p className="text-foreground/70">
                  {contactData.cta.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full glass glass-hover transition-all duration-300 group bg-foreground/10 hover:bg-foreground/20 text-foreground border-white/20 relative"
                  onClick={() => {
                    const whatsappLink = getWhatsAppLink(contactData.phone || '', '');
                    window.open(whatsappLink, '_blank');
                  }}
                  title="Message me on WhatsApp"
                >
                  <MessageCircle className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  {contactData.cta.button1}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full glass glass-hover transition-all duration-300 group border-white/20 text-foreground hover:bg-white/10 relative"
                  onClick={() => {
                    const whatsappLink = getWhatsAppLink(contactData.phone || '', '');
                    window.open(whatsappLink, '_blank');
                  }}
                  title="Schedule a call on WhatsApp"
                >
                  <Calendar className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  {contactData.cta.button2}
                </Button>
              </div>

              {/* Response Time */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-foreground/60">
                  {contactData.responseTime}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
          </>
        )}
      </div>
    </motion.section>
  );
}
