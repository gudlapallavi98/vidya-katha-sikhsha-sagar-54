
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const TestimonialsSection = () => {
  return (
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
  );
};

export default TestimonialsSection;
