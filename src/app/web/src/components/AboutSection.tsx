import { Card } from "./ui/card";

export function AboutSection() {
  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 glass-subtle rounded-full opacity-20 subtle-float"></div>
        <div className="absolute bottom-20 left-10 w-56 h-56 glass-subtle rounded-full opacity-15 subtle-float" style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="glass-card rounded-2xl p-8 mb-8">
            <h2 className="text-4xl text-foreground mb-4">About Me</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-foreground to-transparent mx-auto"></div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="glass-card rounded-xl p-6 glass-hover">
              <p className="text-muted-foreground leading-relaxed">
                I'm a seasoned software architect with over a decade of experience designing and 
                building enterprise-grade applications. My journey began in full-stack development 
                and evolved into leading engineering teams and architecting scalable systems.
              </p>
            </div>
            <div className="glass-card rounded-xl p-6 glass-hover">
              <p className="text-muted-foreground leading-relaxed">
                I specialize in cloud-native architectures, microservices, and DevOps practices. 
                My approach combines technical excellence with business acumen, ensuring that 
                solutions not only solve immediate problems but also support long-term growth.
              </p>
            </div>
            <div className="glass-card rounded-xl p-6 glass-hover">
              <p className="text-muted-foreground leading-relaxed">
                When I'm not coding, I enjoy mentoring junior developers, contributing to open-source 
                projects, and staying up-to-date with emerging technologies in the software 
                engineering landscape.
              </p>
            </div>
          </div>
          
          <Card className="glass-card glass-hover border-white/20">
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center group">
                  <div className="glass-subtle rounded-xl p-4 mb-3 group-hover:scale-105 transition-transform duration-200 h-24 flex flex-col justify-center">
                    <div className="text-3xl text-foreground mb-2">10+</div>
                    <div className="text-muted-foreground text-sm leading-tight">Years Experience</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="glass-subtle rounded-xl p-4 mb-3 group-hover:scale-105 transition-transform duration-200 h-24 flex flex-col justify-center">
                    <div className="text-3xl text-foreground mb-2">50+</div>
                    <div className="text-muted-foreground text-sm leading-tight">Projects Delivered</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="glass-subtle rounded-xl p-4 mb-3 group-hover:scale-105 transition-transform duration-200 h-24 flex flex-col justify-center">
                    <div className="text-3xl text-foreground mb-2">15+</div>
                    <div className="text-muted-foreground text-sm leading-tight">Technologies</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="glass-subtle rounded-xl p-4 mb-3 group-hover:scale-105 transition-transform duration-200 h-24 flex flex-col justify-center">
                    <div className="text-3xl text-foreground mb-2">5+</div>
                    <div className="text-muted-foreground text-sm leading-tight">Team Members Led</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}