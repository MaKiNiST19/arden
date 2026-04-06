import HeroSlider from '@/components/home/HeroSlider';
import CategoryBar from '@/components/home/CategoryBar';
import PopularProducts from '@/components/home/PopularProducts';
import BentoGrid from '@/components/home/BentoGrid';
import DiscountedProducts from '@/components/home/DiscountedProducts';
import VideoSection from '@/components/home/VideoSection';
import OutfitCTA from '@/components/home/OutfitCTA';
import CustomerPhotos from '@/components/home/CustomerPhotos';
import FeaturesBar from '@/components/home/FeaturesBar';
import SeoText from '@/components/home/SeoText';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <CategoryBar />
      <PopularProducts />
      <BentoGrid />
      <DiscountedProducts />
      <VideoSection />
      <FeaturesBar />
      <OutfitCTA />
      <CustomerPhotos />
      <SeoText />
    </>
  );
}
