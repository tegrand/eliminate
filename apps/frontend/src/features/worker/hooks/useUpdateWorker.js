import { useState } from "react";

export const useUpdateWorker = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateWorker = async (id, data) => {
    setIsLoading(true);
    console.log(`Mock API call to update worker ${id} with:`, data);
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        resolve({ success: true });
      }, 1500);
    });
  };

  return { updateWorker, isLoading };
};
