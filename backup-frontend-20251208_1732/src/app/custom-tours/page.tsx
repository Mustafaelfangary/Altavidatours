'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Compass, Users, Calendar, MapPin, Clock, Star, 
  CheckCircle, ArrowRight, Heart, Sparkles, Settings,
  Phone, Mail, MessageCircle, Camera, Crown
} from 'lucide-react';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { AnimatedSection } from '@/components/ui/animated-section';

interface CustomTourForm {
  travelStyle: string;
  duration: string;
  groupSize: string;
  budget: string;
  interests: string[];
  accommodation: string;
  transportation: string;
  specialRequests: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

const travelStyles = [
  { id: 'luxury', name: 'Luxury', icon: <Crown className="w-6 h-6" />, description: 'Premium accommodations and exclusive experiences' },
  { id: 'adventure', name: 'Adventure', icon: <Compass className="w-6 h-6" />, description: 'Active tours with thrilling activities' },
  { id: 'cultural', name: 'Cultural', icon: <Camera className="w-6 h-6" />, description: 'Immersive cultural and historical experiences' },
  { id: 'family', name: 'Family', icon: <Heart className="w-6 h-6" />, description: 'Family-friendly tours for all ages' }
];

const customFeatures = [
  {
    icon: <Settings className="w-8 h-8 text-orange-600" />,
    title: 'Fully Customizable',
    description: 'Every aspect of your tour can be tailored to your preferences, from destinations to activities and accommodation.'
  },
  {
    icon: <Users className="w-8 h-8 text-orange-600" />,
    title: 'Personal Guide',
    description: 'Dedicated expert guides who understand your interests and adapt the experience to your group\'s needs.'
  },
  {
    icon: <Star className="w-8 h-8 text-orange-600" />,
    title: 'Exclusive Access',
    description: 'Special arrangements for private viewings, after-hours access, and experiences not available to regular tourists.'
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-orange-600" />,
    title: 'Complete Planning',
    description: 'We handle every detail from transportation and accommodation to meals and activities, ensuring a seamless experience.'
  }
];

const sampleItineraries = [
  {
    id: 'luxury-honeymoon',
    title: 'Romantic Nile Honeymoon',
    duration: '10 days',
    highlights: ['Private Dahabiya Cruise', 'Couples Spa Treatments', 'Sunset Dinners', 'Hot Air Balloon'],
    image: '/images/Royal Cleopatra/DSC_8740.jpg',
    price: 'From $4,500'
  },
  {
    id: 'family-adventure',
    title: 'Family Discovery Tour',
    duration: '8 days',
    highlights: ['Kid-Friendly Activities', 'Educational Experiences', 'Safe Adventures', 'Family Accommodations'],
    image: '/images/Royal Cleopatra/DSC_8848.jpg',
    price: 'From $2,800'
  },
  {
    id: 'photography-expedition',
    title: 'Photography Expedition',
    duration: '12 days',
    highlights: ['Golden Hour Shoots', 'Professional Guide', 'Exclusive Locations', 'Photo Workshops'],
    image: '/images/Royal Cleopatra/DSC_8625.jpg',
    price: 'From $3,200'
  }
];

export default function CustomToursPage() {
  const [formData, setFormData] = useState<CustomTourForm>({
    travelStyle: '',
    duration: '',
    groupSize: '',
    budget: '',
    interests: [],
    accommodation: '',
    transportation: '',
    specialRequests: '',
    contactInfo: { name: '', email: '', phone: '' }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const interestOptions = [
    'Ancient Temples', 'Pyramids & Tombs', 'Nile Cruise', 'Desert Adventures', 
    'Cultural Workshops', 'Culinary Experiences', 'Wildlife Safari', 'Photography',
    'Archaeology', 'Local Markets', 'Traditional Music', 'Spa & Wellness'
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleInputChange = (field: string, value: string, section?: string) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section as keyof CustomTourForm], [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const submitForm = () => {
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-red-50">
      <UnifiedHero
        imageSrc="/images/Royal Cleopatra/DSC_8625.jpg"
        title="Custom Tours"
        subtitle="Design Your Perfect Egyptian Adventure"
        hieroglyphicTitle={false}
        showEgyptianElements={true}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
      >
        <div className="text-center max-w-4xl mx-auto text-gray-900">
          <div className="flex justify-center mb-6">
            <Settings className="w-12 h-12 text-orange-600" />
          </div>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed px-4 sm:px-0">
            Create a completely personalized Egyptian journey tailored to your interests, preferences, and dreams. 
            Our expert team will craft every detail to ensure your perfect adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
              <Settings className="w-5 h-5 mr-2" />
              Start Planning
            </Button>
            <Button variant="outline" className="border-orange-600 text-orange-800 hover:bg-orange-50 px-6 py-3 rounded-lg">
              <MessageCircle className="w-5 h-5 mr-2" />
              Speak to Expert
            </Button>
          </div>
        </div>
      </UnifiedHero>

      {/* Custom Tour Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose <span className="text-orange-600">Custom Tours</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Experience Egypt exactly the way you want with tours designed exclusively for you and your group.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {customFeatures.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <Card className="h-full text-center hover:shadow-lg transition-all duration-300 border-orange-200">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Tour Planner */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Plan Your <span className="text-orange-600">Custom Tour</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Tell us about your dream Egyptian adventure and we'll create a personalized itinerary just for you.
              </p>
            </div>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            <Card className="border-orange-200">
              <CardContent className="p-8">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
                    <span className="text-sm font-medium text-gray-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Step 1: Travel Style */}
                {currentStep === 1 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Travel Style</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {travelStyles.map((style) => (
                        <Card
                          key={style.id}
                          className={`cursor-pointer transition-all duration-300 border-2 ${
                            formData.travelStyle === style.id 
                              ? 'border-orange-600 bg-orange-50' 
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                          onClick={() => handleInputChange('travelStyle', style.id)}
                        >
                          <CardContent className="p-6 text-center">
                            <div className="flex justify-center mb-4 text-orange-600">
                              {style.icon}
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">{style.name}</h4>
                            <p className="text-gray-600 text-sm">{style.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Trip Details */}
                {currentStep === 2 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Trip Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                        <select
                          value={formData.duration}
                          onChange={(e) => handleInputChange('duration', e.target.value)}
                          className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select duration</option>
                          <option value="3-5 days">3-5 days</option>
                          <option value="6-8 days">6-8 days</option>
                          <option value="9-12 days">9-12 days</option>
                          <option value="13+ days">13+ days</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Group Size</label>
                        <select
                          value={formData.groupSize}
                          onChange={(e) => handleInputChange('groupSize', e.target.value)}
                          className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select group size</option>
                          <option value="1-2 people">1-2 people</option>
                          <option value="3-4 people">3-4 people</option>
                          <option value="5-8 people">5-8 people</option>
                          <option value="9+ people">9+ people</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                        <select
                          value={formData.budget}
                          onChange={(e) => handleInputChange('budget', e.target.value)}
                          className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select budget range</option>
                          <option value="$1,000-2,500">$1,000-2,500</option>
                          <option value="$2,500-5,000">$2,500-5,000</option>
                          <option value="$5,000-10,000">$5,000-10,000</option>
                          <option value="$10,000+">$10,000+</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation Preference</label>
                        <select
                          value={formData.accommodation}
                          onChange={(e) => handleInputChange('accommodation', e.target.value)}
                          className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select accommodation</option>
                          <option value="Luxury Hotels">Luxury Hotels (5-star)</option>
                          <option value="Boutique Hotels">Boutique Hotels (4-star)</option>
                          <option value="Traditional Hotels">Traditional Hotels (3-star)</option>
                          <option value="Mixed Options">Mixed Options</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Interests */}
                {currentStep === 3 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">What Interests You?</h3>
                    <p className="text-gray-600 mb-6">Select all activities and experiences that appeal to you:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {interestOptions.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleInterestToggle(interest)}
                          className={`p-3 text-sm rounded-lg border transition-all duration-300 ${
                            formData.interests.includes(interest)
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'bg-white text-gray-700 border-orange-200 hover:border-orange-400'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                      <textarea
                        value={formData.specialRequests}
                        onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                        rows={4}
                        placeholder="Any special requirements, dietary restrictions, accessibility needs, or specific experiences you'd like to include..."
                        className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 resize-vertical"
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Contact Information */}
                {currentStep === 4 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          value={formData.contactInfo.name}
                          onChange={(e) => handleInputChange('name', e.target.value, 'contactInfo')}
                          className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          value={formData.contactInfo.email}
                          onChange={(e) => handleInputChange('email', e.target.value, 'contactInfo')}
                          className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={formData.contactInfo.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value, 'contactInfo')}
                          className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-orange-50 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-3">What happens next?</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" /> We'll review your preferences within 24 hours</li>
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" /> Our travel expert will contact you to discuss details</li>
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" /> We'll create a custom itinerary just for you</li>
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" /> You can review and modify before booking</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="border-orange-600 text-orange-800 hover:bg-orange-50"
                  >
                    Previous
                  </Button>
                  
                  {currentStep < totalSteps ? (
                    <Button
                      onClick={nextStep}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={submitForm}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Submit Request
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Itineraries */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Sample Custom <span className="text-orange-600">Itineraries</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Get inspired by these custom tours we've created for previous clients. Each can be adapted to your preferences.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {sampleItineraries.map((itinerary, index) => (
              <AnimatedSection key={itinerary.id} delay={index * 100}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-orange-200">
                  <div className="relative h-48">
                    <Image
                      src={itinerary.image}
                      alt={itinerary.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {itinerary.duration}
                    </div>
                    <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm">
                      {itinerary.price}
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{itinerary.title}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <h4 className="font-semibold text-gray-900 text-sm">Highlights:</h4>
                      <ul className="space-y-1">
                        {itinerary.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center">
                            <Sparkles className="w-3 h-3 text-orange-500 mr-2 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      <Settings className="w-4 h-4 mr-2" />
                      Customize This Tour
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Plan Your Dream Tour?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Our travel experts are standing by to help create the perfect Egyptian adventure tailored just for you. 
              Contact us today to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-lg">
                <Phone className="w-5 h-5 mr-2" />
                Call Expert
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-lg">
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
