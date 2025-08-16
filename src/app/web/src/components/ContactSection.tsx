import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Mail, Phone, MapPin, Linkedin, Github, Twitter } from "lucide-react";

export function ContactSection() {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "john.anderson@email.com",
      href: "mailto:john.anderson@email.com"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "San Francisco, CA",
      href: "#"
    }
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/johnanderson",
      username: "johnanderson"
    },
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/johnanderson",
      username: "johnanderson"
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: "https://twitter.com/johnanderson",
      username: "@johnanderson"
    }
  ];

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 glass-subtle rounded-full opacity-10 subtle-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 glass-subtle rounded-full opacity-15 subtle-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="glass-card rounded-2xl p-8 mb-8">
            <h2 className="text-4xl text-foreground mb-4">Get In Touch</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-foreground to-transparent mx-auto"></div>
            <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
              I'm always open to discussing new opportunities, interesting projects, 
              or just having a conversation about technology and software architecture.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Card className="glass-card glass-hover border-white/20">
            <div className="p-8">
              <div className="glass-subtle rounded-lg p-4 mb-6">
                <h3 className="text-xl text-foreground">Contact Information</h3>
              </div>
              
              <div className="space-y-6">
                {contactInfo.map((contact, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-4 glass-subtle rounded-lg p-4 glass-hover"
                  >
                    <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
                      <contact.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{contact.label}</div>
                      <a 
                        href={contact.href}
                        className="text-foreground hover:text-muted-foreground transition-colors"
                      >
                        {contact.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <div className="glass-subtle rounded-lg p-4 mb-4">
                  <h4 className="text-base text-foreground mb-4">Follow Me</h4>
                </div>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="glass-button border-white/20 hover:bg-white/10 flex-1"
                      asChild
                    >
                      <a href={social.href} target="_blank" rel="noopener noreferrer">
                        <social.icon className="h-4 w-4 mr-2" />
                        {social.label}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          
          {/* Quick Contact */}
          <Card className="glass-card glass-hover border-white/20">
            <div className="p-8">
              <div className="glass-subtle rounded-lg p-4 mb-6">
                <h3 className="text-xl text-foreground">Let's Collaborate</h3>
              </div>
              
              <div className="space-y-6">
                <div className="text-muted-foreground glass-subtle rounded-lg p-4">
                  <p className="mb-4">
                    Whether you're looking for a technical leader to architect your next 
                    big project or need consultation on scaling your engineering team, 
                    I'd love to hear from you.
                  </p>
                  <p className="mb-6">
                    I'm particularly interested in:
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Technical leadership and architecture roles</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Cloud migration and modernization projects</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Speaking and consulting opportunities</span>
                    </li>
                  </ul>
                </div>
                
                <Button 
                  className="w-full glass-button text-foreground hover:text-background group relative overflow-hidden"
                  asChild
                >
                  <a href="mailto:john.anderson@email.com">
                    <span className="relative z-10 flex items-center justify-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </span>
                    <div className="absolute inset-0 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-white/10">
          <div className="glass-card rounded-xl p-6">
            <p className="text-muted-foreground">
              © 2024 John Anderson. Built with React and Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}