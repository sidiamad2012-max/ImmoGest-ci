import { useState, useEffect } from 'react';
import { mockDataStore } from '../store/mockDataStore';

export function useRealTimeStats(propertyId: string) {
  const [stats, setStats] = useState(() => mockDataStore.getPropertyStats(propertyId));
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to manually trigger a refresh
  const refreshStats = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Update stats whenever the trigger changes
  useEffect(() => {
    const newStats = mockDataStore.getPropertyStats(propertyId);
    setStats(newStats);
  }, [propertyId, refreshTrigger]);

  // Set up periodic refresh (optional - for demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      const newStats = mockDataStore.getPropertyStats(propertyId);
      setStats(newStats);
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [propertyId]);

  return {
    stats,
    refreshStats,
    // Helper methods for specific statistics
    occupancyRate: Math.round((stats.occupiedUnits / stats.totalUnits) * 100),
    availableUnitsCount: stats.availableUnits,
    maintenanceUnitsCount: stats.maintenanceUnits,
    totalRevenue: stats.monthlyRevenue
  };
}