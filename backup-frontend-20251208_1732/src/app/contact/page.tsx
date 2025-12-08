"use client";

import React, { useState, useEffect } from 'react';
import { AnimatedSection } from '@/components/ui/animated-section';
import { useContent } from '@/hooks/useContent';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  MessageCircle,
  Send,
  Globe,
  Calendar,
  Star,
  Award,
  Shield,
  Heart,
  CheckCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { TravelOKContactForm } from '@/components/contact/TravelOKContactForm';

export default function ContactPage() {
  const { getContent } = useContent({ page: 'contact' });
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-travelok-blue/10 to-travelok-blue/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-travelok-blue mx-auto mb-4"></div>
          <p className="text-xl text-travelok-blue">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-travelok-blue to-travelok-blue-dark">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {getContent('contact_hero_title', '🛥️ Contact AltaVida Tours')}
          </h1>
          <p className="text-xl md:text-2xl text-travelok-orange mb-8 max-w-3xl mx-auto">
            {getContent('contact_hero_subtitle', 'Ready to embark on your Egyptian dahabiya adventure? Get in touch with our travel experts.')}
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              {getContent('contact_feature_1', '24/7 Support')}
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              {getContent('contact_feature_2', 'Expert Guidance')}
            </div>
            <div className="flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              {getContent('contact_feature_3', 'Personalized Service')}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-in">
            <TravelOKContactForm />
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Contact Options */}
      <section className="py-16 bg-travelok-blue/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-travelok-blue-dark mb-4">
              {getContent('contact_instant_title', '🚀 Prefer Instant Communication?')}
            </h2>
            <p className="text-lg text-travelok-gray max-w-2xl mx-auto">
              {getContent('contact_instant_subtitle', 'Connect with us instantly through your favorite platform')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-travelok-blue-dark mb-2">{getContent('contact_whatsapp_title', 'WhatsApp')}</h3>
              <p className="text-sm text-travelok-gray mb-4">{getContent('contact_whatsapp_desc', 'Instant messaging')}</p>
              <button
                onClick={() => window.open(getContent('whatsapp_link', 'https://wa.me/20952370574'), '_blank')}
                className="btn-travelok-secondary w-full text-sm py-2"
              >
                {getContent('contact_whatsapp_btn', '💬 Chat Now')}
              </button>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-travelok-blue-dark mb-2">{getContent('contact_telegram_title', 'Telegram')}</h3>
              <p className="text-sm text-travelok-gray mb-4">{getContent('contact_telegram_desc', 'Quick updates')}</p>
              <button
                onClick={() => window.open(getContent('telegram_link', 'https://t.me/altavidatours'), '_blank')}
                className="btn-travelok-secondary w-full text-sm py-2"
              >
                {getContent('contact_telegram_btn', '🚀 Join Channel')}
              </button>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="font-bold text-travelok-blue-dark mb-2">{getContent('contact_facebook_title', 'Facebook')}</h3>
              <p className="text-sm text-travelok-gray mb-4">{getContent('contact_facebook_desc', 'Community & reviews')}</p>
              <button
                onClick={() => window.open(getContent('facebook_link', 'https://facebook.com/altavidatours'), '_blank')}
                className="btn-travelok-secondary w-full text-sm py-2"
              >
                {getContent('contact_facebook_btn', '👥 Follow Us')}
              </button>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-bold text-travelok-blue-dark mb-2">{getContent('contact_instagram_title', 'Instagram')}</h3>
              <p className="text-sm text-travelok-gray mb-4">{getContent('contact_instagram_desc', 'Visual inspiration')}</p>
              <button
                onClick={() => window.open(getContent('instagram_link', 'https://instagram.com/altavidatours'), '_blank')}
                className="btn-travelok-secondary w-full text-sm py-2"
              >
                {getContent('contact_instagram_btn', '📸 Follow')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}