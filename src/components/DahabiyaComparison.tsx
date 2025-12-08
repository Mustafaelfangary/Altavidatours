import Image from 'next/image';
import { motion } from 'framer-motion';
import { Settings } from '@/types/settings';

interface Props {
  settings: Record<string, any> | Settings;
}

export default function DahabiyaComparison({ settings }: Props) {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-red-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-red-900 mb-4">
            {settings.dahabiya_comparison_title}
          </h2>
          <p className="text-xl text-red-800">
            {settings.dahabiya_comparison_subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              {settings.dahabiya_comparison_description}
            </p>
            <ul className="space-y-4">
              {settings.dahabiya_comparison_points?.map((point: string, index: number) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white">
                    ✓
                  </span>
                  <span className="text-gray-700">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {settings.dahabiya_comparison_gallery?.map((image: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="relative aspect-square rounded-lg overflow-hidden shadow-xl"
                >
                  <Image
                    src={image}
                    alt={`Dahabiya experience ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 