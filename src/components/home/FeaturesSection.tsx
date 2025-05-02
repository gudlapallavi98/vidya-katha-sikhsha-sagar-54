
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookOpen, Video, Award } from "lucide-react";
import { motion } from "framer-motion";

const FeaturesSection = () => {
  const features = [
    {
      icon: <GraduationCap className="h-6 w-6 text-indian-saffron" />,
      title: "Expert Teachers",
      description: "Learn from qualified tutors with years of teaching experience.",
      bgColor: "bg-indian-saffron/10",
      textColor: "text-indian-saffron",
      delay: 0,
    },
    {
      icon: <BookOpen className="h-6 w-6 text-indian-green" />,
      title: "Comprehensive Curriculum",
      description: "Structured courses designed to cover all essential topics.",
      bgColor: "bg-indian-green/10",
      textColor: "text-indian-green",
      delay: 0.1,
    },
    {
      icon: <Video className="h-6 w-6 text-indian-blue" />,
      title: "Interactive Sessions",
      description: "Engage in live video classes with real-time doubt solving.",
      bgColor: "bg-indian-blue/10",
      textColor: "text-indian-blue",
      delay: 0.2,
    },
    {
      icon: <Award className="h-6 w-6 text-indian-saffron" />,
      title: "Proven Results",
      description: "Our students consistently achieve academic excellence.",
      bgColor: "bg-indian-saffron/10",
      textColor: "text-indian-saffron",
      delay: 0.3,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section className="py-16 px-4 indian-pattern-bg overflow-hidden">
      <div className="container">
        <motion.h2 
          className="font-sanskrit text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Why Choose <span className="text-indian-saffron">Vidya</span> <span className="text-indian-blue">Katha</span>
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group h-full">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <motion.div 
                    className={`h-12 w-12 rounded-full ${feature.bgColor} flex items-center justify-center mb-4`}
                    whileHover={{ 
                      scale: 1.2,
                      rotate: 360
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className={`font-sanskrit text-xl font-bold mb-2 ${feature.textColor} transition-colors duration-300 group-hover:text-indian-blue`}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
