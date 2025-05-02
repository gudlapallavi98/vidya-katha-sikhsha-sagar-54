
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FeaturedCourses from "@/components/courses/FeaturedCourses";

const CourseSection = () => {
  return (
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
  );
};

export default CourseSection;
