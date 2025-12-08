"use client";

import Link from "next/link";
import { useState } from "react";

export default function TripPlannerWidget() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {isExpanded && (
        <div className="bg-white border-2 border-orange-500 rounded-lg shadow-lg p-4 mb-2 w-80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-travelok-blue">Plan Your Egypt Adventure</h3>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
              <input 
                type="date" 
                className="w-full p-2 border border-gray-300 rounded focus:border-travelok-blue focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <select className="w-full p-2 border border-gray-300 rounded focus:border-travelok-blue focus:outline-none">
                <option>Day Tour</option>
                <option>3-4 Days</option>
                <option>1 Week</option>
                <option>2 Weeks</option>
                <option>Custom Duration</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
              <select className="w-full p-2 border border-gray-300 rounded focus:border-travelok-blue focus:outline-none">
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>3-4 Guests</option>
                <option>5+ Guests</option>
              </select>
            </div>
            
            <button className="w-full bg-travelok-orange hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors">
              Get Custom Quote
            </button>
          </div>
        </div>
      )}
      
      {/* Trip Planner Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg shadow-lg flex items-center space-x-2 transition-colors"
      >
        <div className="flex flex-col items-center">
          <div className="text-2xl mb-1">📍</div>
          <div className="text-xs leading-tight">
            <div>TRIP</div>
            <div>PLANNER</div>
          </div>
        </div>
      </button>
    </div>
  );
}
