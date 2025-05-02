
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
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
  );
};

export default CTASection;
