
import { GraduationCap, BookOpen, Users, Award, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutUsPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-indian-saffron/5 via-white to-indian-green/5">
        <div className="container text-center">
          <h1 className="font-sanskrit text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            About <span className="text-orange-500">E</span><span className="text-indian-blue">tutors</span><span className="text-green-500">s</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-10">
            Our mission is to blend traditional Indian teaching wisdom with modern technology to provide
            quality education accessible to all.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/courses">
              <Button className="bg-indian-saffron hover:bg-indian-saffron/90">
                Explore Our Courses
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 indian-pattern-bg">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Students studying" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="font-sanskrit text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Etutorss was founded by Aura Foundation, which was established in 2007 by a group of passionate educators who believed that quality education should be accessible to everyone, regardless of geographical constraints.
              </p>
              <p className="text-muted-foreground mb-4">
                The name "Etutorss" represents our commitment to electronic tutoring and personalized learning experiences. We believe that education is not just about learning facts, but about understanding the story behind the knowledge.
              </p>
              <p className="text-muted-foreground">
                What started as a small initiative with just a handful of teachers and students has now grown into a robust platform connecting thousands of learners with expert educators across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-indian-blue text-white">
        <div className="container">
          <h2 className="font-sanskrit text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="font-sanskrit text-xl font-bold mb-2">Quality Education</h3>
              <p className="text-white/80">
                We are committed to maintaining high standards in all our courses and teaching methods.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-sanskrit text-xl font-bold mb-2">Inclusivity</h3>
              <p className="text-white/80">
                We believe that education should be accessible to all, regardless of their background.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8" />
              </div>
              <h3 className="font-sanskrit text-xl font-bold mb-2">Innovation</h3>
              <p className="text-white/80">
                We continuously adapt and improve our platform to enhance the learning experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="font-sanskrit text-xl font-bold mb-2">Excellence</h3>
              <p className="text-white/80">
                We strive for excellence in everything we do, from course content to student support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="font-sanskrit text-3xl font-bold text-center mb-6">Our Leadership Team</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Meet the dedicated educators and professionals behind Etutorss who are committed to transforming online education in India.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Team Member" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg mb-1">Dr. Rajesh Sharma</h3>
              <p className="text-sm text-muted-foreground mb-2">Founder & CEO</p>
              <p className="text-sm text-muted-foreground">
                Former Professor of Education at Delhi University with over 25 years of experience in education management.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="Team Member" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg mb-1">Dr. Priya Patel</h3>
              <p className="text-sm text-muted-foreground mb-2">Academic Director</p>
              <p className="text-sm text-muted-foreground">
                Expert in curriculum development with a Ph.D. in Educational Psychology from JNU.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://randomuser.me/api/portraits/men/67.jpg" 
                  alt="Team Member" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg mb-1">Vikram Mehta</h3>
              <p className="text-sm text-muted-foreground mb-2">Chief Technology Officer</p>
              <p className="text-sm text-muted-foreground">
                Tech entrepreneur with expertise in educational technology and e-learning platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-indian-saffron/5 via-white to-indian-green/5">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-indian-saffron mb-2">5000+</h3>
              <p className="text-muted-foreground">Students Enrolled</p>
            </div>
            
            <div>
              <h3 className="text-4xl font-bold text-indian-blue mb-2">200+</h3>
              <p className="text-muted-foreground">Expert Teachers</p>
            </div>
            
            <div>
              <h3 className="text-4xl font-bold text-indian-green mb-2">100+</h3>
              <p className="text-muted-foreground">Courses Offered</p>
            </div>
            
            <div>
              <h3 className="text-4xl font-bold text-indian-saffron mb-2">25+</h3>
              <p className="text-muted-foreground">States Reached</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indian-saffron text-white">
        <div className="container text-center">
          <h2 className="font-sanskrit text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg">
            Join thousands of students who are already benefiting from our expert-led courses.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-indian-saffron hover:bg-white/90">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
