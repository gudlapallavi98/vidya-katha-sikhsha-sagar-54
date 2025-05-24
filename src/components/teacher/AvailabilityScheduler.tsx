
import AvailabilityForm from "./availability/AvailabilityForm";
import { AvailabilityList } from "./availability/AvailabilityList";
import { useAvailabilityData } from "./availability/hooks/useAvailabilityData";
import { useAutoCancelCheck } from "./availability/hooks/useAutoCancelCheck";

export function AvailabilityScheduler() {
  const {
    subjects,
    availabilities,
    isLoading,
    fetchAvailabilities,
  } = useAvailabilityData();

  useAutoCancelCheck(availabilities, fetchAvailabilities);

  const handleAvailabilityAdded = () => {
    fetchAvailabilities();
  };

  const handleAvailabilityRemoved = () => {
    fetchAvailabilities();
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <AvailabilityForm 
        subjects={subjects} 
        onAvailabilityCreated={handleAvailabilityAdded}
      />
      <AvailabilityList 
        availabilities={availabilities} 
        onAvailabilityRemoved={handleAvailabilityRemoved} 
      />
    </div>
  );
}

export default AvailabilityScheduler;
