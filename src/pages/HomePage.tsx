import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookOpen, Award, Users, Video } from "lucide-react";
import FeaturedCourses from "@/components/courses/FeaturedCourses";

const HomePage = () => {
  const heroImages = [
    "/hero1.jpg",
    "/hero2.jpg",
    "/hero3.jpg",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Auto-scrolling Carousel and Hero Image */}
      <section className="relative overflow-hidden bg-indian-blue text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="flex animate-carousel">
            {heroImages.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <div 
                  className="h-[500px] w-screen bg-cover bg-center bg-no-repeat"
                  style={{backgroundImage: `url(${image})`}}
                ></div>
              </div>
            ))}
            {/* Duplicate images for seamless looping */}
            {heroImages.map((image, index) => (
              <div key={`dup-${index}`} className="w-full flex-shrink-0">
                <div 
                  className="h-[500px] w-screen bg-cover bg-center bg-no-repeat"
                  style={{backgroundImage: `url(${image})`}}
                ></div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container relative z-10 flex h-[500px] flex-col items-center justify-center text-center">
          <h1 className="font-sanskrit text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl">
            Unlock Your Potential with <span className="text-indian-saffron">Vidya</span> <span className="text-white">Katha</span>
          </h1>
          <p className="max-w-2xl text-lg mb-10">
            Traditional wisdom meets modern education. Learn from expert teachers in a personalized environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/courses">
              <Button size="lg" className="bg-indian-saffron hover:bg-indian-saffron/90 text-white">
                Explore Courses
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                Join as Student/Teacher
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 indian-pattern-bg">
        <div className="container">
          <h2 className="font-sanskrit text-3xl md:text-4xl font-bold text-center mb-12">Why Choose <span className="text-indian-saffron">Vidya</span> <span className="text-indian-blue">Katha</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-indian-saffron/10 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-indian-saffron" />
                </div>
                <h3 className="font-sanskrit text-xl font-bold mb-2">Expert Teachers</h3>
                <p className="text-muted-foreground">Learn from qualified tutors with years of teaching experience.</p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-indian-green/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-indian-green" />
                </div>
                <h3 className="font-sanskrit text-xl font-bold mb-2">Comprehensive Curriculum</h3>
                <p className="text-muted-foreground">Structured courses designed to cover all essential topics.</p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-indian-blue/10 flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-indian-blue" />
                </div>
                <h3 className="font-sanskrit text-xl font-bold mb-2">Interactive Sessions</h3>
                <p className="text-muted-foreground">Engage in live video classes with real-time doubt solving.</p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-indian-saffron/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-indian-saffron" />
                </div>
                <h3 className="font-sanskrit text-xl font-bold mb-2">Proven Results</h3>
                <p className="text-muted-foreground">Our students consistently achieve academic excellence.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-gradient-to-r from-indian-saffron/5 to-indian-green/5">
        <div className="container">
          <h2 className="font-sanskrit text-3xl md:text-4xl font-bold text-center mb-4">Explore Our Courses</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Discover a wide range of courses designed to help you excel in your academic journey
          </p>
          <FeaturedCourses />
          <div className="flex justify-center mt-10">
            <Link to="/courses">
              <Button className="bg-indian-blue hover:bg-indian-blue/90">View All Courses</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 indian-pattern-bg">
        <div className="container">
          <h2 className="font-sanskrit text-3xl md:text-4xl font-bold text-center mb-12">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-5 w-5 fill-indian-saffron" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 15.585l-7.01 3.684 1.336-7.79L.506 7.282l7.834-1.137L10 0l1.66 6.145 7.834 1.137-3.82 3.725 1.336 7.79L10 15.585z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"The teachers at Vidya Katha are exceptional. I was struggling with mathematics, but after just a few sessions, I started improving dramatically."</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="h-10 w-10 rounded-full bg-indian-blue/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-indian-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium">Anjali Sharma</h4>
                      <p className="text-sm text-muted-foreground">Class 10 Student</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-5 w-5 fill-indian-saffron" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 15.585l-7.01 3.684 1.336-7.79L.506 7.282l7.834-1.137L10 0l1.66 6.145 7.834 1.137-3.82 3.725 1.336 7.79L10 15.585z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"The platform is so intuitive and the video sessions are crystal clear. I've been able to prepare for my JEE exams without leaving home."</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="h-10 w-10 rounded-full bg-indian-green/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-indian-green" />
                    </div>
                    <div>
                      <h4 className="font-medium">Rahul Patel</h4>
                      <p className="text-sm text-muted-foreground">JEE Aspirant</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-5 w-5 fill-indian-saffron" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 15.585l-7.01 3.684 1.336-7.79L.506 7.282l7.834-1.137L10 0l1.66 6.145 7.834 1.137-3.82 3.725 1.336 7.79L10 15.585z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"As a parent, I'm extremely satisfied with my child's progress. The teachers are not only knowledgeable but also very patient and supportive."</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="h-10 w-10 rounded-full bg-indian-saffron/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-indian-saffron" />
                    </div>
                    <div>
                      <h4 className="font-medium">Priya Iyer</h4>
                      <p className="text-sm text-muted-foreground">Parent</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indian-blue text-white">
        <div className="container text-center">
          <h2 className="font-sanskrit text-3xl md:text-4xl font-bold mb-6">Ready to Begin Your Learning Journey?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg">
            Join thousands of students already learning with Vidya Katha Online.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-indian-saffron hover:bg-indian-saffron/90">
                Register Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
