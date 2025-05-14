
import {
  BookOpen,
  Users,
  Globe,
  Clock,
  Award,
  MessageCircle,
} from "lucide-react";

const features = [
  {
    icon: <BookOpen className="h-12 w-12 text-indian-saffron" />,
    title: "Expert Teachers",
    description:
      "Learn from experienced educators who are experts in their subjects.",
  },
  {
    icon: <Users className="h-12 w-12 text-indian-saffron" />,
    title: "Personalized Learning",
    description:
      "Get individualized attention and customized learning plans tailored to your needs.",
  },
  {
    icon: <Globe className="h-12 w-12 text-indian-saffron" />,
    title: "Learn Anywhere",
    description:
      "Access classes from any location with our flexible online learning platform.",
  },
  {
    icon: <Clock className="h-12 w-12 text-indian-saffron" />,
    title: "Flexible Schedule",
    description:
      "Book sessions at times that work for you with our convenient scheduling system.",
  },
  {
    icon: <Award className="h-12 w-12 text-indian-saffron" />,
    title: "Certified Courses",
    description:
      "Earn certificates upon completion to showcase your new skills.",
  },
  {
    icon: <MessageCircle className="h-12 w-12 text-indian-saffron" />,
    title: "Interactive Sessions",
    description:
      "Engage in real-time conversations and get immediate feedback during live classes.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Etutorss</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We combine traditional teaching wisdom with modern technology to provide
            a comprehensive and effective learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
