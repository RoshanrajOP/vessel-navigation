import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Image paths
const startMarkerImg = process.env.PUBLIC_URL + '/location_svgrepo.com (1).png';
const endMarkerImg = process.env.PUBLIC_URL + '/location_svgrepo.com (2).png';
const vesselImg = process.env.PUBLIC_URL + '/Frame 334.png';

const VesselNavigation = ({ start, end }) => {
    const [position, setPosition] = useState(start);
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
    const [moving, setMoving] = useState(false);

    const steps = 7; // Number of steps to reach the end
    const intervalRef = useRef(null);

    // Define custom icons with larger and elongated sizes
    const startMarkerIcon = L.icon({
        iconUrl: startMarkerImg,
        iconSize: [50, 50], // Size for start marker
        iconAnchor: [25, 25],
    });

    const endMarkerIcon = L.icon({
        iconUrl: endMarkerImg,
        iconSize: [50, 50], // Size for end marker
        iconAnchor: [25, 25],
    });

    const vesselIcon = L.icon({
        iconUrl: vesselImg,
        iconSize: [120, 60], // Elongated size for rocket
        iconAnchor: [60, 30],
    });

    const calculatePosition = (step) => {
        const lat = start[0] + (end[0] - start[0]) * (step / steps);
        const lng = start[1] + (end[1] - start[1]) * (step / steps);
        return [lat, lng];
    };

    const moveRocket = () => {
        setMoving(true);
        intervalRef.current = setInterval(() => {
            setStep((prevStep) => {
                if (direction === 1 && prevStep < steps) {
                    return prevStep + 1;
                } else if (direction === -1 && prevStep > 0) {
                    return prevStep - 1;
                } else {
                    clearInterval(intervalRef.current);
                    setMoving(false);
                    return prevStep;
                }
            });
        }, 1000); // Adjust the speed of movement by changing this value
    };

    useEffect(() => {
        const newPosition = calculatePosition(step);
        setPosition(newPosition);
    }, [step]);

    const handleRocketClick = () => {
        if (!moving) {
            setDirection(1);
            moveRocket();
        }
    };

    const handleEndClick = () => {
        if (!moving) {
            setDirection(-1);
            moveRocket();
        }
    };

    return (
        <MapContainer center={start} zoom={12} style={{ height: '100vh', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={start} icon={startMarkerIcon} />
            <Marker position={end} icon={endMarkerIcon} eventHandlers={{ click: handleEndClick }} />
            <Marker position={position} icon={vesselIcon} eventHandlers={{ click: handleRocketClick }} />
        </MapContainer>
    );
};

export default VesselNavigation;
