
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
}

const SEO = ({
  title = "eTutorss - Online Learning Platform",
  description = "Find the best tutors for your academic needs. Schedule sessions, learn at your own pace, and achieve your educational goals.",
  keywords = "tutoring, online learning, education, academic help, tutors, virtual classroom",
  ogImage = "/og-image.jpg",
  ogUrl = "https://etutorss.com",
}: SEOProps) => {
  const fullTitle = title.includes("eTutorss") ? title : `${title} | eTutorss`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={ogUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={ogUrl} />
    </Helmet>
  );
};

export default SEO;
