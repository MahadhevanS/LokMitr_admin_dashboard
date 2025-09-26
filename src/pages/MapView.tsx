import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

// Define the type for the dynamically loaded component
type FixItUpMapComponentType = React.FC | null;

// --- Loading Component for Suspense-like experience ---
const MapLoadingState: React.FC = () => (
    <div className="absolute inset-0 bg-muted rounded-lg flex items-center justify-center z-10">
        <MapPin className="w-12 h-12 animate-pulse text-muted-foreground" />
        <p className="ml-4 text-xl font-medium text-muted-foreground">Loading Interactive Map...</p>
    </div>
);

export default function MapView() {
    // State to hold the dynamically imported map component
    const [FixItUpMapComponent, setFixItUpMapComponent] = useState<FixItUpMapComponentType>(null);

    // useEffect for client-side dynamic import
    useEffect(() => {
        import('@/components/FixItUpMap')
            .then(mod => {
                setFixItUpMapComponent(() => mod.default);
            })
            .catch(error => {
                console.error("Failed to load map component:", error);
            });
    }, []);

    // Rename for cleaner JSX
    const DynamicMap = FixItUpMapComponent;

    return (
        // The main container provides the required height for the map
        <div className="p-6 h-[calc(100vh-5rem)]">
            <div className="h-full relative">
                {/* Integrate the Dynamic Map Component with a ternary operator */}
                {DynamicMap ? (
                    <DynamicMap />
                ) : (
                    <MapLoadingState />
                )}
            </div>
        </div>
    );
}