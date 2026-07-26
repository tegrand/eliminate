import { useState } from "react";

export const useCreateWorker = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createWorker = async (data) => {
    setIsLoading(true);
    console.log("Mock API call to create worker with:", data);
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        resolve({ success: true });
      }, 1500);
    });
  };

  return { createWorker, isLoading };
};
