
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookOpen, Video, Award } from "lucide-react";

const FeaturesSection = () => {
  return (
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
  );
};

export default FeaturesSection;
